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
});