import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from '../TopBar';

describe('TopBar Component', () => {
  test('renders the dashboard title', () => {
    render(<TopBar />);
    
    const titleElement = screen.getByText('Operation Honey Badger: Admin Dashboard');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H1');
    expect(titleElement).toHaveClass('text-xl');
    expect(titleElement).toHaveClass('font-bold');
    expect(titleElement).toHaveClass('text-gray-900');
  });

  test('renders search input', () => {
    render(<TopBar />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.tagName).toBe('INPUT');
    expect(searchInput.type).toBe('text');
  });

  test('search input accepts text input', () => {
    render(<TopBar />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
  });

  test('search input clears when reset', () => {
    render(<TopBar />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput.value).toBe('test search');
    
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput.value).toBe('');
  });

  test('has correct styling classes', () => {
    render(<TopBar />);
    
    // Check if the main container has expected styling classes
    const container = screen.getByText('Operation Honey Badger: Admin Dashboard').closest('div');
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('shadow-md');
    expect(container).toHaveClass('fixed');
    expect(container).toHaveClass('z-50');
    
    // Check if the search input has expected styling classes
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toHaveClass('border');
    expect(searchInput).toHaveClass('border-gray-300');
    expect(searchInput).toHaveClass('rounded-lg');
    expect(searchInput).toHaveClass('focus:outline-none');
  });

  test('renders with proper layout', () => {
    render(<TopBar />);
    
    // Check if the container uses flex layout for positioning
    const container = screen.getByText('Operation Honey Badger: Admin Dashboard').closest('div');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('justify-between');
    expect(container).toHaveClass('items-center');
  });
  
  test('has correct padding and spacing', () => {
    render(<TopBar />);
    
    const container = screen.getByText('Operation Honey Badger: Admin Dashboard').closest('div');
    expect(container).toHaveClass('py-4');
    expect(container).toHaveClass('px-6');
  });
});