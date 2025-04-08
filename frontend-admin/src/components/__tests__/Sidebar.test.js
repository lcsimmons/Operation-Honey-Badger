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

describe('Sidebar Component', () => {
  test('renders with collapsed state by default', () => {
    render(<Sidebar />);
    
    // Check for logo
    const logo = screen.getByAltText('Honey Badger Logo');
    expect(logo).toBeInTheDocument();
    
    // Check that text is not visible in collapsed state
    const dashboardText = screen.queryByText('Dashboard');
    expect(dashboardText).not.toBeInTheDocument();
  });

  test('expands on mouse enter', () => {
    render(<Sidebar />);
    
    const sidebar = screen.getByAltText('Honey Badger Logo').closest('div').parentElement;
    
    // Trigger mouse enter
    fireEvent.mouseEnter(sidebar);
    
    // Now the text should be visible
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText).toBeInTheDocument();
  });

  test('collapses on mouse leave', () => {
    render(<Sidebar />);
    
    const sidebar = screen.getByAltText('Honey Badger Logo').closest('div').parentElement;
    
    // First expand it
    fireEvent.mouseEnter(sidebar);
    
    // Then leave
    fireEvent.mouseLeave(sidebar);
    
    // Text should be hidden again
    const dashboardText = screen.queryByText('Dashboard');
    expect(dashboardText).not.toBeInTheDocument();
  });

  test('stays expanded when a link is clicked', () => {
    render(<Sidebar />);
    
    // Get the sidebar element
    const sidebar = screen.getByAltText('Honey Badger Logo').closest('div').parentElement;
    
    // First expand it
    fireEvent.mouseEnter(sidebar);
    
    // Get any link and click it
    const homeLink = screen.getByText('Dashboard').closest('a');
    fireEvent.click(homeLink);
    
    // Now try to collapse it by leaving
    fireEvent.mouseLeave(sidebar);
    
    // It should still be expanded
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    render(<Sidebar />);
    
    // Expand the sidebar
    const sidebar = screen.getByAltText('Honey Badger Logo').closest('div').parentElement;
    fireEvent.mouseEnter(sidebar);
    
    // Check for all links
    const navItems = [
      { text: 'Dashboard', href: '/' },
      { text: 'Logs', href: '/logs' },
      { text: 'Reports', href: '/reports' },
      { text: 'Alerts', href: '/alerts' },
      { text: 'Settings', href: '/settings' },
      { text: 'Admin', href: '/profile' },
      { text: 'Logout', href: '/logout' }
    ];
    
    navItems.forEach(item => {
      const linkText = screen.getByText(item.text);
      expect(linkText).toBeInTheDocument();
      expect(linkText.closest('a')).toHaveAttribute('href', item.href);
    });
  });
});