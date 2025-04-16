import { render, screen, fireEvent } from '@testing-library/react';
import ReportButton from '../ReportButton';

describe('ReportButton Component', () => {
  beforeEach(() => {
    // Clear the mock for alert
    global.alert.mockClear();
  });

  test('renders report button with flag emoji', () => {
    render(<ReportButton postId="123" />);
    
    const button = screen.getByText(/🚩 Report/);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-red-500');
  });

  test('clicking the button triggers an alert with the post ID', () => {
    render(<ReportButton postId="123" />);
    
    const button = screen.getByText(/🚩 Report/);
    fireEvent.click(button);
    
    expect(global.alert).toHaveBeenCalledWith('Post 123 has been reported.');
  });

  test('button has hover effect class', () => {
    render(<ReportButton postId="123" />);
    
    const button = screen.getByText(/🚩 Report/);
    expect(button).toHaveClass('hover:text-red-700');
  });

  test('works with different post IDs', () => {
    render(<ReportButton postId="abc" />);
    
    const button = screen.getByText(/🚩 Report/);
    fireEvent.click(button);
    
    expect(global.alert).toHaveBeenCalledWith('Post abc has been reported.');
  });
});