import { render, screen, fireEvent } from '@testing-library/react';
import ThreadedReplies from '../ThreadedReplies';

describe('ThreadedReplies Component', () => {
  const mockPostId = '123';
  const mockUsername = 'TestUser';
  const mockPosts = [
    { 
      id: '123', 
      message: 'Main post content', 
      replies: [
        { user: 'User1', avatar: '/avatar1.png', message: 'First reply' },
        { user: 'User2', avatar: '/avatar2.png', message: 'Second reply' }
      ] 
    },
    { 
      id: '456', 
      message: 'Another post', 
      replies: [] 
    }
  ];
  
  const mockSetPosts = jest.fn();
  
  beforeEach(() => {
    mockSetPosts.mockClear();
  });

  test('renders existing replies', () => {
    render(
      <ThreadedReplies
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
        username={mockUsername}
      />
    );
    
    // Check for replies content
    expect(screen.getByText('First reply')).toBeInTheDocument();
    expect(screen.getByText('Second reply')).toBeInTheDocument();
    
    // Check for user names
    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('User2')).toBeInTheDocument();
    
    // Check for avatars
    const avatars = screen.getAllByAltText('User Avatar');
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveAttribute('src', '/avatar1.png');
    expect(avatars[1]).toHaveAttribute('src', '/avatar2.png');
  });

  test('renders reply input field and button', () => {
    render(
      <ThreadedReplies
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
        username={mockUsername}
      />
    );
    
    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });

  test('updates textarea value when typing', () => {
    render(
      <ThreadedReplies
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
        username={mockUsername}
      />
    );
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'This is a test reply' } });
    
    expect(textarea).toHaveValue('This is a test reply');
  });

  test('submits a new reply when clicking the button', () => {
    render(
      <ThreadedReplies
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
        username={mockUsername}
      />
    );
    
    // Type a reply
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'This is a test reply' } });
    
    // Submit the reply
    const replyButton = screen.getByText('Reply');
    fireEvent.click(replyButton);
    
    // Check that setPosts was called
    expect(mockSetPosts).toHaveBeenCalledTimes(1);
    
    // Test the callback function that was passed to setPosts
    const setPostsCallback = mockSetPosts.mock.calls[0][0];
    const updatedPosts = setPostsCallback(mockPosts);
    
    // Check that the reply was added to the correct post
    expect(updatedPosts[0].id).toBe('123');
    expect(updatedPosts[0].replies).toHaveLength(3);
    expect(updatedPosts[0].replies[2]).toEqual({
      user: mockUsername,
      avatar: '/default.png',
      message: 'This is a test reply'
    });
    
    // Check that other posts were not modified
    expect(updatedPosts[1]).toEqual(mockPosts[1]);
  });

  test('clears the textarea after submitting', () => {
    render(
      <ThreadedReplies
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
        username={mockUsername}
      />
    );
    
    // Type a reply
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'This is a test reply' } });
    
    // Submit the reply
    const replyButton = screen.getByText('Reply');
    fireEvent.click(replyButton);
    
    // Check that the textarea is cleared
    expect(textarea).toHaveValue('');
  });

  test('does not submit empty replies', () => {
    render(
      <ThreadedReplies
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
        username={mockUsername}
      />
    );
    
    // Try to submit without typing anything
    const replyButton = screen.getByText('Reply');
    fireEvent.click(replyButton);
    
    // Check that setPosts was not called
    expect(mockSetPosts).not.toHaveBeenCalled();
  });

  test('does not submit whitespace-only replies', () => {
    render(
      <ThreadedReplies
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
        username={mockUsername}
      />
    );
    
    // Type only whitespace
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: '   ' } });
    
    // Try to submit
    const replyButton = screen.getByText('Reply');
    fireEvent.click(replyButton);
    
    // Check that setPosts was not called
    expect(mockSetPosts).not.toHaveBeenCalled();
  });
});