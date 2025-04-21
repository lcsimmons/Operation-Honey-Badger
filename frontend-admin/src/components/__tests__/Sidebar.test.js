import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../sidebar';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href, onClick }) => {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  };
});

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon" />,
  List: () => <div data-testid="list-icon" />,
  Clipboard: () => <div data-testid="clipboard-icon" />,
  AlertTriangle: () => <div data-testid="alert-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  User: () => <div data-testid="user-icon" />,
  LogOut: () => <div data-testid="logout-icon" />
}));

describe('Sidebar Component', () => {
  test('renders with collapsed state by default', () => {
    render(<Sidebar />);
    
    // Check for logo
    const logo = screen.getByAltText('Honey Badger Logo');
    expect(logo).toBeInTheDocument();
    
    // Check that text is not visible in collapsed state
    const dashboardText = screen.queryByText('Dashboard');
    expect(dashboardText).not.toBeInTheDocument();
    
    // Check that icons are visible
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('list-icon')).toBeInTheDocument();
    expect(screen.getByTestId('clipboard-icon')).toBeInTheDocument();
  });

  test('expands on mouse enter', () => {
    render(<Sidebar />);
    
    // Get the outermost sidebar div, not its children
    const sidebar = screen.getByAltText('Honey Badger Logo')
      .closest('div') // Logo container
      .parentElement    // Relative flex container
      .parentElement;   // Main sidebar div
    
    // Trigger mouse enter
    fireEvent.mouseEnter(sidebar);
    
    // Now the text should be visible
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText).toBeInTheDocument();
    
    // Check that the width class has changed
    expect(sidebar).toHaveClass('w-60');
    expect(sidebar).not.toHaveClass('w-20');
  });

  test('collapses on mouse leave', () => {
    render(<Sidebar />);
    
    // Get the outermost sidebar div, not its children
    const sidebar = screen.getByAltText('Honey Badger Logo')
      .closest('div') // Logo container
      .parentElement    // Relative flex container
      .parentElement;   // Main sidebar div
    
    // First expand it
    fireEvent.mouseEnter(sidebar);
    
    // Then leave
    fireEvent.mouseLeave(sidebar);
    
    // Text should be hidden again
    const dashboardText = screen.queryByText('Dashboard');
    expect(dashboardText).not.toBeInTheDocument();
    
    // Check that the width class has changed back
    expect(sidebar).toHaveClass('w-20');
    expect(sidebar).not.toHaveClass('w-60');
  });

  test('stays expanded when a link is clicked', () => {
    render(<Sidebar />);
    
    // Get the outermost sidebar div, not its children
    const sidebar = screen.getByAltText('Honey Badger Logo')
      .closest('div') // Logo container
      .parentElement    // Relative flex container
      .parentElement;   // Main sidebar div
    
    // First expand it
    fireEvent.mouseEnter(sidebar);
    
    // Get home link and click it
    const homeIcon = screen.getByTestId('home-icon');
    const homeLink = homeIcon.closest('a');
    fireEvent.click(homeLink);
    
    // Now try to collapse it by leaving
    fireEvent.mouseLeave(sidebar);
    
    // It should still be expanded
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText).toBeInTheDocument();
    expect(sidebar).toHaveClass('w-60');
  });

  test('renders navigation links', () => {
    render(<Sidebar />);
    
    // Get the outermost sidebar div, not its children
    const sidebar = screen.getByAltText('Honey Badger Logo')
      .closest('div') // Logo container
      .parentElement    // Relative flex container
      .parentElement;   // Main sidebar div
    
    // Expand the sidebar
    fireEvent.mouseEnter(sidebar);
    
    // Check the navigation links that actually appear in the component
    const navItems = [
      { text: 'Dashboard', href: '/', testId: 'home-icon' },
      { text: 'Logs', href: '/logs', testId: 'list-icon' },
      { text: 'Reports', href: '/reports', testId: 'clipboard-icon' },
      { text: 'Settings', href: '/settings', testId: 'settings-icon' },
      { text: 'Admin', href: '/profile', testId: 'user-icon' },
      { text: 'Logout', href: '/logout', testId: 'logout-icon' }
    ];
    
    // Check each navigation item individually
    navItems.forEach(item => {
      const linkText = screen.getByText(item.text);
      expect(linkText).toBeInTheDocument();
      expect(linkText.closest('a')).toHaveAttribute('href', item.href);
      expect(screen.getByTestId(item.testId)).toBeInTheDocument();
    });
  });
  
  test('logout link has special styling', () => {
    render(<Sidebar />);
    
    // Get the outermost sidebar div and expand it
    const sidebar = screen.getByAltText('Honey Badger Logo')
      .closest('div')
      .parentElement
      .parentElement;
    
    fireEvent.mouseEnter(sidebar);
    
    // Find the logout text element
    const logoutText = screen.getByText('Logout');
    const logoutContainer = logoutText.closest('div');
    
    // Check for red text styling on the container
    expect(logoutContainer).toHaveClass('text-red-500');
  });
  
  test('manual expand persists across interactions', () => {
    render(<Sidebar />);
    
    // Get the outermost sidebar div
    const sidebar = screen.getByAltText('Honey Badger Logo')
      .closest('div')
      .parentElement
      .parentElement;
    
    // First expand it
    fireEvent.mouseEnter(sidebar);
    
    // Click a link to manually expand
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    fireEvent.click(dashboardLink);
    
    // Try mouse leave and enter again
    fireEvent.mouseLeave(sidebar);
    expect(screen.getByText('Dashboard')).toBeInTheDocument(); // Still visible
    
    fireEvent.mouseEnter(sidebar);
    expect(screen.getByText('Dashboard')).toBeInTheDocument(); // Still visible
    
    // Should stay expanded
    expect(sidebar).toHaveClass('w-60');
  });
});