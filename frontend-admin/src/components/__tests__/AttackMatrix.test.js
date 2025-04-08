import { render, screen, fireEvent } from '@testing-library/react';
import AttackMatrix from '../AttackMatrix';

describe('AttackMatrix Component', () => {
  test('renders the component with title', () => {
    render(<AttackMatrix />);
    const titleElement = screen.getByText('MITRE ATT&CK Matrix');
    expect(titleElement).toBeInTheDocument();
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
    });
  });

  test('displays frequency counts for tactics', () => {
    render(<AttackMatrix />);
    const executionFrequency = screen.getByText('15 Reports');
    const discoveryFrequency = screen.getByText('18 Reports');
    
    expect(executionFrequency).toBeInTheDocument();
    expect(discoveryFrequency).toBeInTheDocument();
  });

  test('displays attack techniques for each tactic', () => {
    render(<AttackMatrix />);
    const techniques = [
      'Phishing', 'Command and Scripting Interpreter', 
      'Browser Extensions', 'Process Injection', 
      'Obfuscated Files or Information', 'OS Credential Dumping',
      'System Information Discovery', 'Remote Services', 'Clipboard Data'
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
  });

  // Note: This component doesn't seem to actually implement search filtering
  // functionality yet - when implemented, add tests for that behavior
});