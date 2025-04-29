import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import WorldMap from '../WorldMap';
import { feature } from 'topojson-client';

// Mock any modules that WorldMap depends on
jest.mock('topojson-client', () => ({
  feature: jest.fn()
}));

jest.mock('../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

jest.mock('../../context/LanguageContext', () => ({
  LanguageContext: React.createContext({ language: 'en' }),
}));


// Mock the useDashboardText hook without specifying the module path
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useContext: jest.fn().mockReturnValue({ language: 'en' })
  };
});

// Mock d3 methods with proper function implementations
jest.mock('d3', () => {
  // Create mock implementations
  const projectionMock = {
    scale: jest.fn().mockReturnThis(),
    translate: jest.fn().mockReturnThis()
  };
  
  const pathGeneratorMock = jest.fn(() => 'mock-path-data');
  pathGeneratorMock.projection = jest.fn().mockReturnValue(pathGeneratorMock);
  
  return {
    geoEqualEarth: jest.fn().mockReturnValue(projectionMock),
    geoPath: jest.fn().mockReturnValue(pathGeneratorMock)
  };
});

// Mock the countries import
jest.mock('world-countries', () => [
  { ccn3: '840', cca2: 'US', name: { common: 'United States' } },
  { ccn3: '156', cca2: 'CN', name: { common: 'China' } },
  { ccn3: '643', cca2: 'RU', name: { common: 'Russia' } },
  { ccn3: '250', cca2: 'FR', name: { common: 'France' } },
  { ccn3: '826', cca2: 'GB', name: { common: 'United Kingdom' } }
]);

describe('WorldMap Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock worldGeoData with a valid structure
    feature.mockReturnValue({
      features: [
        { id: 840, type: 'Feature', geometry: {}, properties: {} }, // US
        { id: 156, type: 'Feature', geometry: {}, properties: {} }, // CN
        { id: 643, type: 'Feature', geometry: {}, properties: {} }  // RU
      ]
    });
    
    // Mock fetch to return resolved promises
    global.fetch = jest.fn();
    global.fetch.mockImplementation((url) => {
      if (url.includes('world-atlas')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            objects: { countries: {} }
          })
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve({
            US: 2, CN: 1, RU: 1, FR: 1, GB: 1
          })
        });
      }
    });

    // Set the environment variable
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';
  });

  // Simple test case that doesn't rely on the map rendering
  test('renders the component with title', async () => {
    await act(async () => {
      render(<WorldMap />);
    });
    
    const titleElement = screen.getByText(/Attacker Geolocation/i);
    expect(titleElement).toBeInTheDocument();
  });

  // Test for refresh button presence
  test('renders refresh button', async () => {
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Find the button either by role or text content containing "Refresh"
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  // Test that refresh button text updates after loading
  test('shows refresh button after data loads', async () => {
    // Setup a quicker resolving mock
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        json: () => Promise.resolve(
          { US: 2, CN: 1, RU: 1, FR: 1, GB: 1 }
        )
      })
    );

    await act(async () => {
      render(<WorldMap />);
    });
    
    // Initially button might show "Refreshing..."
    // After data loads it should contain "Refresh"
    await waitFor(() => {
      const buttonText = screen.getByRole('button').textContent;
      return buttonText.includes('Refresh') && !buttonText.includes('ing');
    }, { timeout: 1000 });
    
    expect(screen.getByRole('button').textContent).toContain('Refresh');
  });

  // Test clicking the refresh button
  test('clicking refresh button calls fetchCountryData', async () => {
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Wait for the initial data load to complete
    await waitFor(() => {
      const buttonText = screen.getByRole('button').textContent;
      return buttonText.includes('Refresh') && !buttonText.includes('ing');
    }, { timeout: 1000 });
    
    // Reset the fetch mock
    global.fetch.mockClear();
    
    // Click the refresh button
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalled();
  });

  // Test for error state
  test('displays error message when map fails to load', async () => {
    // Mock a fetch failure
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to load map data')));
    
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load map data')).toBeInTheDocument();
    });
  });

  // Test for top countries list
  test('displays top countries list', async () => {
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Check for top countries heading
    expect(screen.getByText(/Top 5 Countries/i)).toBeInTheDocument();
  });

  // Test for map key display
  test('displays map key', async () => {
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Check for map key heading
    expect(screen.getByText(/Map Key/i)).toBeInTheDocument();
    
    // Check for color ranges
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('1–2')).toBeInTheDocument();
    expect(screen.getByText('3–10')).toBeInTheDocument();
    expect(screen.getByText('11–20')).toBeInTheDocument();
    expect(screen.getByText('21+')).toBeInTheDocument();
  });
  
  // Test for country list display
  test('displays correct number of countries in top list', async () => {
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Allow time for data to load and render
    await waitFor(() => {
      const listItems = screen.getByText(/Top 5 Countries/i)
        .parentElement
        .querySelectorAll('li');
      return listItems.length > 0;
    }, { timeout: 1000 });
    
    // Check that we have 5 countries displayed
    const listItems = screen.getByText(/Top 5 Countries/i)
      .parentElement
      .querySelectorAll('li');
    expect(listItems.length).toBe(5);
  });
  
  // Test for correct plural forms
  test('shows correct plural form for attackers in top countries', async () => {
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Wait for data to load
    await waitFor(() => {
      return screen.getAllByText(/attacker/i).length > 0;
    }, { timeout: 1000 });
    
    // Check for plural form (2 attackers)
    expect(screen.getByText(/2 attackers/i)).toBeInTheDocument();
    
    // Check for singular form (1 attacker) - using getAllByText since multiple countries have 1 attacker
    const singularForms = screen.getAllByText(/1 attacker$/i);
    expect(singularForms.length).toBeGreaterThan(0);
    
    // Verify one specific country with singular form
    expect(screen.getByText(/China.*1 attacker$/i)).toBeInTheDocument();
  });
  
  // Test for loading state
  test('shows loading state when refreshing data', async () => {
    // Render with delayed resolution
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Wait for initial load to complete
    await waitFor(() => {
      const buttonText = screen.getByRole('button').textContent;
      return buttonText.includes('Refresh') && !buttonText.includes('ing');
    }, { timeout: 1000 });
    
    // Setup a delayed promise for the next fetch
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        json: () => Promise.resolve({ US: 3, CN: 2 })
      }), 50))
    );
    
    // Click refresh
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    // Check for loading state
    expect(screen.getByText(/Refreshing/i)).toBeInTheDocument();
  });
  
  // Test for empty data handling
  test('handles empty country data gracefully', async () => {
    // Use empty data response
    global.fetch.mockImplementationOnce((url) => {
      if (url.includes('world-atlas')) {
        return Promise.resolve({
          json: () => Promise.resolve({ objects: { countries: {} } })
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve({}) // Empty data
        });
      }
    });
    
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Verify component rendered
    expect(screen.getByText(/Attacker Geolocation/i)).toBeInTheDocument();
    expect(screen.getByText(/Top 5 Countries/i)).toBeInTheDocument();
    
    // Note: WorldMap.js has fallback data, so we can't test for empty list
    // Instead, let's verify the component doesn't crash
    expect(document.querySelector('.bg-white')).toBeInTheDocument();
  });
  
  // Test for API error handling
  test('handles API error with fallback data', async () => {
    // Mock API error
    global.fetch.mockImplementationOnce((url) => {
      if (url.includes('world-atlas')) {
        return Promise.resolve({
          json: () => Promise.resolve({ objects: { countries: {} } })
        });
      } else {
        return Promise.reject(new Error('API error'));
      }
    });
    
    await act(async () => {
      render(<WorldMap />);
    });
    
    // Allow time for fallback data to load
    await waitFor(() => {
      const listItems = screen.getByText(/Top 5 Countries/i)
        .parentElement
        .querySelectorAll('li');
      return listItems.length > 0;
    }, { timeout: 1000 });
    
    // Verify fallback data is displayed
    const listItems = screen.getByText(/Top 5 Countries/i)
      .parentElement
      .querySelectorAll('li');
    expect(listItems.length).toBeGreaterThan(0);
  });
});