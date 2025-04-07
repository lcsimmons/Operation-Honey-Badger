import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from '../TopBar';

describe('TopBar Component', () => {
  test('renders the dashboard title', () => {
    render(<TopBar />);
    
    const titleElement = screen.getByText('Operation Honey Badger: Admin Dashboard');
    expect(titleElement).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<TopBar />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
  });

  test('search input accepts text input', () => {
    render(<TopBar />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
  });

  test('has correct styling classes', () => {
    render(<TopBar />);
    
    // Check if the main container has expected styling classes
    const container = screen.getByText('Operation Honey Badger: Admin Dashboard').closest('div');
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('shadow-md');
    expect(container).toHaveClass('fixed');
    
    // Check if the search input has expected styling classes
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toHaveClass('border');
    expect(searchInput).toHaveClass('rounded-lg');
  });
});