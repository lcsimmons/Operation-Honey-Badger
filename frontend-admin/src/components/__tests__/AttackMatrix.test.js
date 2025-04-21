import { render, screen, fireEvent } from '@testing-library/react';
import AttackMatrix from '../AttackMatrix';

describe('AttackMatrix Component', () => {
  test('renders the component with title', () => {
    render(<AttackMatrix />);
    const titleElement = screen.getByText('MITRE ATT&CK Matrix');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('text-lg');
    expect(titleElement).toHaveClass('font-bold');
  });

  test('renders search input', () => {
    render(<AttackMatrix />);
    const searchInput = screen.getByPlaceholderText('Search techniques...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass('p-2');
    expect(searchInput).toHaveClass('border');
    expect(searchInput).toHaveClass('rounded-lg');
  });

  test('renders all tactics in the header', () => {
    render(<AttackMatrix />);
    const tactics = [
      'Initial Access', 'Execution', 'Persistence', 'Privilege Escalation',
      'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement', 'Collection'
    ];
    
    tactics.forEach(tactic => {
      const tacticElement = screen.getByText(tactic);
      expect(tacticElement).toBeInTheDocument();
      
      // Check if it's in the header row
      const headerCell = tacticElement.closest('th');
      expect(headerCell).toBeInTheDocument();
    });
  });

  test('displays frequency counts for tactics', () => {
    render(<AttackMatrix />);
    
    // Check for specific frequency counts with "Reports" text
    const frequencies = {
      'Initial Access': '5 Reports',
      'Execution': '15 Reports',
      'Persistence': '10 Reports',
      'Privilege Escalation': '8 Reports',
      'Defense Evasion': '20 Reports',
      'Credential Access': '12 Reports',
      'Discovery': '18 Reports',
      'Lateral Movement': '6 Reports',
      'Collection': '9 Reports'
    };
    
    Object.entries(frequencies).forEach(([tactic, count]) => {
      const countElement = screen.getByText(count);
      expect(countElement).toBeInTheDocument();
    });
  });

  test('applies correct color coding based on frequency', () => {
    render(<AttackMatrix />);
    
    // Test for specific cells instead of finding by regex pattern
    const highSeverityCells = [
      screen.getByText('20 Reports'),
      screen.getByText('18 Reports'),
      screen.getByText('15 Reports')
    ];
    
    highSeverityCells.forEach(cell => {
      if (cell.textContent === '20 Reports') {
        expect(cell).toHaveClass('bg-red-600');
        expect(cell).toHaveClass('text-white');
      } else if (cell.textContent === '18 Reports') {
        expect(cell).toHaveClass('bg-red-600');
        expect(cell).toHaveClass('text-white');
      } else if (cell.textContent === '15 Reports') {
        expect(cell).toHaveClass('bg-red-600');
        expect(cell).toHaveClass('text-white');
      }
    });

    // Medium severity (10-14 Reports)
    const mediumSeverityCells = [
      screen.getByText('12 Reports'),
      screen.getByText('10 Reports')
    ];
    
    mediumSeverityCells.forEach(cell => {
      expect(cell).toHaveClass('bg-orange-400');
      expect(cell).toHaveClass('text-black');
    });
    
    // Low severity (5-9 Reports)
    const lowSeverityCells = [
      screen.getByText('9 Reports'),
      screen.getByText('8 Reports'),
      screen.getByText('6 Reports'),
      screen.getByText('5 Reports')
    ];
    
    lowSeverityCells.forEach(cell => {
      expect(cell).toHaveClass('bg-yellow-300');
      expect(cell).toHaveClass('text-black');
    });
  });

  test('displays attack techniques for each tactic', () => {
    render(<AttackMatrix />);
    
    // Sample of techniques to check
    const techniques = [
      'Phishing', 'Drive-by Compromise', 'Valid Accounts',
      'Command and Scripting Interpreter', 'Scheduled Task/Job',
      'Browser Extensions', 'Boot or Logon Initialization Scripts',
      'Process Injection', 'Access Token Manipulation',
      'Obfuscated Files or Information', 'Modify Registry',
      'OS Credential Dumping', 'Brute Force',
      'System Information Discovery', 'File and Directory Discovery',
      'Remote Services', 'Exploitation of Remote Services',
      'Clipboard Data', 'Automated Collection'
    ];
    
    techniques.forEach(technique => {
      const techniqueElement = screen.getByText(technique);
      expect(techniqueElement).toBeInTheDocument();
    });
  });

  test('search input changes value when typed into', () => {
    render(<AttackMatrix />);
    const searchInput = screen.getByPlaceholderText('Search techniques...');
    
    fireEvent.change(searchInput, { target: { value: 'Phishing' } });
    expect(searchInput.value).toBe('Phishing');
    
    fireEvent.change(searchInput, { target: { value: 'Brute Force' } });
    expect(searchInput.value).toBe('Brute Force');
  });

  test('table structure is correctly formed', () => {
    render(<AttackMatrix />);
    
    // Check table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('w-full');
    expect(table).toHaveClass('border');
    expect(table).toHaveClass('border-gray-300');
    
    // Check for thead and tbody
    const tableHeader = table.querySelector('thead');
    expect(tableHeader).toBeInTheDocument();
    
    const tableBody = table.querySelector('tbody');
    expect(tableBody).toBeInTheDocument();
    
    // Check for correct number of rows
    const rows = table.querySelectorAll('tr');
    expect(rows.length).toBe(3); // Header row + frequency row + techniques row
  });
});