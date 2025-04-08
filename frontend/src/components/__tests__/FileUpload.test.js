import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-file-url');

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
    expect(mockSetUploadedFile).toHaveBeenCalledWith('mocked-file-url');
    
    // Check that the success message is displayed
    expect(screen.getByText(/Uploaded:/)).toBeInTheDocument();
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
  });
});