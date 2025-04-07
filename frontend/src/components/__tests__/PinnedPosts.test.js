import { render, screen } from '@testing-library/react';
import PinnedPosts from '../PinnedPosts';

describe('PinnedPosts Component', () => {
  const mockPosts = [
    { 
      id: '1', 
      pinned: true, 
      user: 'Admin', 
      avatar: '/admin.png', 
      timestamp: '2023-04-01', 
      message: 'Important announcement' 
    },
    { 
      id: '2', 
      pinned: true, 
      user: 'HR', 
      avatar: '/hr.png', 
      timestamp: '2023-04-02', 
      message: 'Company policy update' 
    },
    { 
      id: '3', 
      pinned: false, 
      user: 'User', 
      avatar: '/user.png', 
      timestamp: '2023-04-03', 
      message: 'Regular post' 
    }
  ];

  test('renders the pinned posts title', () => {
    render(<PinnedPosts posts={mockPosts} />);
    
    expect(screen.getByText('Pinned Announcements')).toBeInTheDocument();
    expect(screen.getByTestId('icon-pin')).toBeInTheDocument();
  });

  test('renders only pinned posts', () => {
    render(<PinnedPosts posts={mockPosts} />);
    
    // Should show the two pinned posts
    expect(screen.getByText('Important announcement')).toBeInTheDocument();
    expect(screen.getByText('Company policy update')).toBeInTheDocument();
    
    // Should not show the unpinned post
    expect(screen.queryByText('Regular post')).not.toBeInTheDocument();
  });

  test('displays user information for each pinned post', () => {
    render(<PinnedPosts posts={mockPosts} />);
    
    // Check for user names
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
    
    // Check for timestamps
    expect(screen.getByText('2023-04-01')).toBeInTheDocument();
    expect(screen.getByText('2023-04-02')).toBeInTheDocument();
    
    // Check for avatars
    const avatars = screen.getAllByRole('img', { name: 'User Avatar' });
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveAttribute('src', '/admin.png');
    expect(avatars[1]).toHaveAttribute('src', '/hr.png');
  });

  test('renders nothing when there are no pinned posts', () => {
    const noPinnedPosts = [
      { id: '1', pinned: false, user: 'User', message: 'No pins here' }
    ];
    
    render(<PinnedPosts posts={noPinnedPosts} />);
    
    // Title should still be there
    expect(screen.getByText('Pinned Announcements')).toBeInTheDocument();
    
    // But no posts should be rendered
    expect(screen.queryByText('No pins here')).not.toBeInTheDocument();
  });
});