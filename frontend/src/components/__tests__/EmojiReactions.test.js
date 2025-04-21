import { render, screen, fireEvent } from '@testing-library/react';
import EmojiReactions from '../EmojiReactions';

describe('EmojiReactions Component', () => {
  const mockPostId = '123';
  const mockPosts = [
    { id: '123', message: 'Test post', likes: 5 },
    { id: '456', message: 'Another post', likes: 10 }
  ];
  const mockSetPosts = jest.fn();

  beforeEach(() => {
    mockSetPosts.mockClear();
  });

  test('renders all emoji reactions', () => {
    render(
      <EmojiReactions
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
      />
    );

    // Check that all emojis are rendered
    const expectedEmojis = ["👍", "❤️", "😂", "😡", "🎉"];
    expectedEmojis.forEach(emoji => {
      expect(screen.getByText(emoji)).toBeInTheDocument();
    });
  });

  test('clicking an emoji calls setPosts with updated post', () => {
    render(
      <EmojiReactions
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
      />
    );

    // Click the first emoji (👍)
    fireEvent.click(screen.getByText("👍"));

    // Check that setPosts was called with the correct function
    expect(mockSetPosts).toHaveBeenCalledTimes(1);
    
    // Test the callback function that was passed to setPosts
    const setPostsCallback = mockSetPosts.mock.calls[0][0];
    const updatedPosts = setPostsCallback(mockPosts);
    
    // Check that the correct post was updated
    expect(updatedPosts[0].id).toBe('123');
    expect(updatedPosts[0].likes).toBe(6); // 5 + 1
    expect(updatedPosts[0].reaction).toBe('👍');
    
    // Check that other posts were not modified
    expect(updatedPosts[1]).toEqual(mockPosts[1]);
  });

  test('clicking different emojis sets different reactions', () => {
    render(
      <EmojiReactions
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
      />
    );

    // Click the heart emoji
    fireEvent.click(screen.getByText("❤️"));
    
    // Get the setPosts callback
    const setPostsCallback = mockSetPosts.mock.calls[0][0];
    const updatedPosts = setPostsCallback(mockPosts);
    
    // Check that the reaction was set correctly
    expect(updatedPosts[0].reaction).toBe('❤️');
  });

  test('adds likes if no likes property exists', () => {
    const postsWithoutLikes = [
      { id: '123', message: 'Test post' }, // No likes property
      { id: '456', message: 'Another post', likes: 10 }
    ];

    render(
      <EmojiReactions
        postId={mockPostId}
        posts={postsWithoutLikes}
        setPosts={mockSetPosts}
      />
    );

    // Click an emoji
    fireEvent.click(screen.getByText("😂"));
    
    // Test the callback function
    const setPostsCallback = mockSetPosts.mock.calls[0][0];
    const updatedPosts = setPostsCallback(postsWithoutLikes);
    
    // Check that likes is initialized to 1
    expect(updatedPosts[0].likes).toBe(1);
    expect(updatedPosts[0].reaction).toBe('😂');
  });

  test('emoji buttons have hover effect class', () => {
    render(
      <EmojiReactions
        postId={mockPostId}
        posts={mockPosts}
        setPosts={mockSetPosts}
      />
    );

    // Check that all emoji buttons have the hover effect class
    const emojiButtons = screen.getAllByRole('button');
    emojiButtons.forEach(button => {
      expect(button).toHaveClass('hover:scale-110');
      expect(button).toHaveClass('transition');
      expect(button).toHaveClass('transform');
    });
  });

  test('nothing happens when postId does not exist in posts', () => {
    render(
      <EmojiReactions
        postId="nonexistent"
        posts={mockPosts}
        setPosts={mockSetPosts}
      />
    );

    // Click an emoji
    fireEvent.click(screen.getByText("👍"));
    
    // Test the callback function
    const setPostsCallback = mockSetPosts.mock.calls[0][0];
    const updatedPosts = setPostsCallback(mockPosts);
    
    // Check that no posts were modified
    expect(updatedPosts).toEqual(mockPosts);
  });

  test('properly handles empty posts array', () => {
    render(
      <EmojiReactions
        postId={mockPostId}
        posts={[]}
        setPosts={mockSetPosts}
      />
    );

    // Click an emoji - should not throw any errors
    fireEvent.click(screen.getByText("👍"));
    
    // Test the callback function
    const setPostsCallback = mockSetPosts.mock.calls[0][0];
    const updatedPosts = setPostsCallback([]);
    
    // Should return empty array
    expect(updatedPosts).toEqual([]);
  });
});