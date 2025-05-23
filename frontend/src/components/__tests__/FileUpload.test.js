import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');

describe('FileUpload Component', () => {
  const mockSetUploadedFile = jest.fn();

  beforeEach(() => {
    mockSetUploadedFile.mockClear();
    global.URL.createObjectURL.mockClear();
  });

  test('renders file input', () => {
    render(<FileUpload setUploadedFile={mockSetUploadedFile} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput.type).toBe('file');
    expect(fileInput).toHaveClass('text-sm', 'text-gray-600');
  });

  test('handles file selection correctly', () => {
    render(<FileUpload setUploadedFile={mockSetUploadedFile} />);
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    
    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Check that URL.createObjectURL was called with the file
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    
    // Check that setUploadedFile was called with the URL
    expect(mockSetUploadedFile).toHaveBeenCalledWith('mocked-url');
    
    // Check that the success message is displayed
    expect(screen.getByText(/Uploaded: mocked-url/)).toBeInTheDocument();
  });

  test('displays error when setUploadedFile is not a function', () => {
    // Mock console.error to prevent it from showing in test output
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    render(<FileUpload setUploadedFile={null} />);
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    
    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Check that error was logged
    expect(console.error).toHaveBeenCalledWith('Error: setUploadedFile is not a function');
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  test('does nothing when no file is selected', () => {
    render(<FileUpload setUploadedFile={mockSetUploadedFile} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    
    // Simulate empty file selection
    fireEvent.change(fileInput, { target: { files: [] } });
    
    // Check that URL.createObjectURL was not called
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
    
    // Check that setUploadedFile was not called
    expect(mockSetUploadedFile).not.toHaveBeenCalled();
    
    // Check that no success message is displayed
    expect(screen.queryByText(/Uploaded:/)).not.toBeInTheDocument();
  });

  test('handles different file types', () => {
    render(<FileUpload setUploadedFile={mockSetUploadedFile} />);
    
    // Test with different file types
    const imageFile = new File(['image content'], 'image.jpg', { type: 'image/jpeg' });
    const pdfFile = new File(['pdf content'], 'document.pdf', { type: 'application/pdf' });
    
    const fileInput = document.querySelector('input[type="file"]');
    
    // Test image file
    fireEvent.change(fileInput, { target: { files: [imageFile] } });
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(imageFile);
    expect(mockSetUploadedFile).toHaveBeenCalledWith('mocked-url');
    global.URL.createObjectURL.mockClear();
    mockSetUploadedFile.mockClear();
    
    // Test PDF file
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(pdfFile);
    expect(mockSetUploadedFile).toHaveBeenCalledWith('mocked-url');
  });

  test('handles file with no selection after previous selection', () => {
    render(<FileUpload setUploadedFile={mockSetUploadedFile} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    
    // First select a file
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText(/Uploaded: mocked-url/)).toBeInTheDocument();
    
    // Clear mocks
    global.URL.createObjectURL.mockClear();
    mockSetUploadedFile.mockClear();
    
    // Then select nothing (cancel file dialog)
    fireEvent.change(fileInput, { target: { files: [] } });
    
    // Check that the URL and setUploadedFile were not called again
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
    expect(mockSetUploadedFile).not.toHaveBeenCalled();
    
    // Previous message should still be displayed
    expect(screen.getByText(/Uploaded: mocked-url/)).toBeInTheDocument();
  });
});