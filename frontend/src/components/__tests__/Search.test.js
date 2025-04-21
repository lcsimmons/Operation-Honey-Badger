import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../Search';

describe('Search Component', () => {
  const mockAllPosts = [
    { id: '1', message: 'First post about testing', category: 'General' },
    { id: '2', message: 'Second post about development', category: 'IT Support' },
    { id: '3', message: 'Updates from HR department', category: 'HR Announcements' }
  ];
  
  const mockSetFilteredPosts = jest.fn();

  beforeEach(() => {
    mockSetFilteredPosts.mockClear();
  });

  test('renders search input', () => {
    render(
      <Search 
        allPosts={mockAllPosts} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass('p-2', 'rounded-md', 'text-black');
    expect(searchInput).toHaveValue('');
  });

  test('updates search term when typing', () => {
    render(
      <Search 
        allPosts={mockAllPosts} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(searchInput).toHaveValue('test');
  });

  test('filters posts by message content', () => {
    render(
      <Search 
        allPosts={mockAllPosts} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    fireEvent.change(searchInput, { target: { value: 'testing' } });
    
    // Check that setFilteredPosts was called with filtered results
    expect(mockSetFilteredPosts).toHaveBeenCalledWith([mockAllPosts[0]]);
  });

  test('filters posts by category', () => {
    render(
      <Search 
        allPosts={mockAllPosts} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    fireEvent.change(searchInput, { target: { value: 'hr' } });
    
    // Check that setFilteredPosts was called with filtered results
    expect(mockSetFilteredPosts).toHaveBeenCalledWith([mockAllPosts[2]]);
  });

  test('resets to all posts when search term is cleared', () => {
    render(
      <Search 
        allPosts={mockAllPosts} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    
    // First set a search term
    fireEvent.change(searchInput, { target: { value: 'test' } });
    mockSetFilteredPosts.mockClear(); // Clear the mock to test the reset
    
    // Then clear it
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Check that setFilteredPosts was called with all posts
    expect(mockSetFilteredPosts).toHaveBeenCalledWith(mockAllPosts);
  });

  test('handles null allPosts gracefully', () => {
    render(
      <Search 
        allPosts={null} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    
    // Should not throw an error when allPosts is null
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // setFilteredPosts should still be called
    expect(mockSetFilteredPosts).toHaveBeenCalled();
  });

  test('empty array handled correctly', () => {
    render(
      <Search 
        allPosts={[]} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Should return empty array
    expect(mockSetFilteredPosts).toHaveBeenCalledWith([]);
  });

  test('handles case insensitive search', () => {
    render(
      <Search 
        allPosts={mockAllPosts} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    
    // Test with uppercase search term
    fireEvent.change(searchInput, { target: { value: 'HR' } });
    
    // Should find the posts with HR in lowercase
    expect(mockSetFilteredPosts).toHaveBeenCalledWith([mockAllPosts[2]]);
  });

  test('searching with terms that appear in different posts', () => {
    render(
      <Search 
        allPosts={mockAllPosts} 
        setFilteredPosts={mockSetFilteredPosts} 
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search for posts...');
    
    // Search that would match parts of both terms but not across fields
    // The search term "test" would match "testing" in post[0]
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Check that matching posts are found
    expect(mockSetFilteredPosts).toHaveBeenCalledWith([mockAllPosts[0]]);
  });
});