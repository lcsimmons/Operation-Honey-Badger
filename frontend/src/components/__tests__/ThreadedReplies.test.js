import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThreadedReplies from '../ThreadedReplies';

// Mock the API helper
jest.mock('../../pages/api/apiHelper', () => ({
  createForumComment: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (function() {
  let store = {
    username: 'testUser',
    avatar: '/test-avatar.png'
  };
  
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock btoa since it's not available in the test environment
global.btoa = jest.fn(str => `base64encoded-${str}`);
global.TextEncoder = jest.fn(() => ({
  encode: jest.fn(() => new Uint8Array([116, 101, 115, 116])), // 'test' in ASCII
}));

describe('ThreadedReplies Component', () => {
  const mockProps = {
    postId: 'post123',
    posts: [
      {
        forum_id: 'post123',
        replies: [
          {
            id: 'reply1',
            user: 'User1',
            avatar: '/avatar1.png',
            message: 'This is reply 1'
          },
          {
            id: 'reply2',
            user: 'User2',
            avatar: '/avatar2.png',
            message: 'This is reply 2'
          }
        ]
      }
    ],
    setPosts: jest.fn(),
    username: 'testUser'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with existing replies', () => {
    render(<ThreadedReplies {...mockProps} />);
    
    // Check if both replies are rendered
    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('This is reply 1')).toBeInTheDocument();
    expect(screen.getByText('User2')).toBeInTheDocument();
    expect(screen.getByText('This is reply 2')).toBeInTheDocument();
    
    // Check if textarea and button are rendered
    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument();
  });

  test('updates textarea value on change', () => {
    render(<ThreadedReplies {...mockProps} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'Test reply content' } });
    
    expect(textarea.value).toBe('Test reply content');
  });

  test('does not submit empty replies', async () => {
    render(<ThreadedReplies {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: 'Reply' });
    fireEvent.click(submitButton);
    
    expect(mockProps.setPosts).not.toHaveBeenCalled();
  });

  test('does not submit replies with potential injection attacks', async () => {
    render(<ThreadedReplies {...mockProps} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: '<script>alert("XSS")</script>' } });
    
    const submitButton = screen.getByRole('button', { name: 'Reply' });
    fireEvent.click(submitButton);
    
    expect(mockProps.setPosts).not.toHaveBeenCalled();
  });

  test('detects SQL injection attempts', async () => {
    render(<ThreadedReplies {...mockProps} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: "robert'; DROP TABLE users; --" } });
    
    const submitButton = screen.getByRole('button', { name: 'Reply' });
    fireEvent.click(submitButton);
    
    expect(mockProps.setPosts).not.toHaveBeenCalled();
  });

  test('submits valid replies and updates the posts state', async () => {
    // Get reference to the mocked function
    const { createForumComment } = require('../../pages/api/apiHelper');
    
    // Mock successful API response
    createForumComment.mockResolvedValue({
      status: 200,
      data: {
        id: 'newReply123',
        timestamp: '2025-04-15T10:00:00Z'
      }
    });
    
    render(<ThreadedReplies {...mockProps} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'This is a new valid reply' } });
    
    const submitButton = screen.getByRole('button', { name: 'Reply' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Check if the API was called with correct parameters
      expect(createForumComment).toHaveBeenCalledWith({
        username: expect.any(String),
        forum_id: expect.any(String),
        comment: expect.any(String)
      });
      
      // Check if setPosts was called to update the state
      expect(mockProps.setPosts).toHaveBeenCalled();
      
      // Verify that textarea was cleared
      expect(textarea.value).toBe('');
    });
  });

  test('handles API error gracefully', async () => {
    // Get reference to the mocked function
    const { createForumComment } = require('../../pages/api/apiHelper');
    
    // Mock API error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    createForumComment.mockRejectedValue(new Error('API Error'));
    
    render(<ThreadedReplies {...mockProps} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'This is a valid reply' } });
    
    const submitButton = screen.getByRole('button', { name: 'Reply' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating comment:', expect.any(Error));
      expect(mockProps.setPosts).not.toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('handles non-200 API response', async () => {
    // Get reference to the mocked function
    const { createForumComment } = require('../../pages/api/apiHelper');
    
    // Mock failed API response
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    createForumComment.mockResolvedValue({
      status: 400,
      data: { error: 'Bad request' }
    });
    
    render(<ThreadedReplies {...mockProps} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'This is a valid reply' } });
    
    const submitButton = screen.getByRole('button', { name: 'Reply' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create comment');
      expect(mockProps.setPosts).not.toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('handles posts without replies array', () => {
    const propsWithoutReplies = {
      ...mockProps,
      posts: [{ forum_id: 'post123' }] // No replies array
    };
    
    render(<ThreadedReplies {...propsWithoutReplies} />);
    
    // Should not crash and should show the textarea
    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
  });

  test('encodes sensitive data with base64 before submission', async () => {
    // Get reference to the mocked function
    const { createForumComment } = require('../../pages/api/apiHelper');
    
    createForumComment.mockResolvedValue({
      status: 200,
      data: {
        id: 'newReply123',
        timestamp: '2025-04-15T10:00:00Z'
      }
    });
    
    render(<ThreadedReplies {...mockProps} />);
    
    const textarea = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    
    const submitButton = screen.getByRole('button', { name: 'Reply' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(createForumComment).toHaveBeenCalledWith({
        username: expect.stringContaining('base64encoded-'),
        forum_id: expect.stringContaining('base64encoded-'),
        comment: expect.stringContaining('base64encoded-')
      });
    });
  });

  test('uses default avatar when localStorage avatar is not set', () => {
    // Temporarily modify the localStorage mock
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = jest.fn(key => key === 'avatar' ? null : store[key]);
    
    render(<ThreadedReplies {...mockProps} />);
    
    // Verify default avatar is used in component logic
    expect(localStorageMock.getItem).toHaveBeenCalledWith('avatar');
    
    // Restore original implementation
    localStorageMock.getItem = originalGetItem;
  });
});