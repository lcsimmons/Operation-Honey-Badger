// Add Jest testing library custom matchers
import '@testing-library/jest-dom';

// Mock the URL.createObjectURL
if (typeof global.URL.createObjectURL === 'undefined') {
  global.URL.createObjectURL = jest.fn(() => 'mocked-url');
}

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    };
  }
}));

// Note: next/link is now mocked in each test file that needs it
// since the mocking needs are different for different tests

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} alt={props.alt || ''} />;
  }
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const icons = {
    MessageSquare: 'icon-message-square',
    Briefcase: 'icon-briefcase',
    Laptop2: 'icon-laptop',
    Users: 'icon-users',
    Sparkles: 'icon-sparkles',
    BookOpen: 'icon-book-open',
    Pin: 'icon-pin',
  };
  
  // Create an object with mock components for each icon
  return Object.entries(icons).reduce((acc, [name, testId]) => {
    acc[name] = (props) => <div data-testid={testId} {...props}>{name}</div>;
    return acc;
  }, {});
});

// Browser mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock alert
global.alert = jest.fn();