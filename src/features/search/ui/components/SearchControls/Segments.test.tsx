import { render, screen, fireEvent } from '@testing-library/react';
import { Segments } from './Segments';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';

const mockOnSegmentChange = jest.fn();

const mockConfig = {
  id: 'test',
  segments: {
    search: {
      id: 'search',
    },
    browse: {
      id: 'browse',
    },
  },
};

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    config: mockConfig,
    activeUIConfig: {
      features: {
        hasSegments: true,
      },
    },
    onSegmentChange: mockOnSegmentChange,
  }),
}));

describe('Segments', () => {
  test('renders all segments', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {
            segment: 'search',
          },
        },
      },
    ]);

    render(<Segments />);

    expect(screen.getByTestId('id-search-segment-button-search')).toBeInTheDocument();
    expect(screen.getByTestId('id-search-segment-button-browse')).toBeInTheDocument();
  });

  test('highlights currently selected segment', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {
            segment: 'browse',
          },
        },
      },
    ]);

    render(<Segments />);

    const searchButton = screen.getByTestId('id-search-segment-button-search');
    const browseButton = screen.getByTestId('id-search-segment-button-browse');

    // Check that browse button is highlighted (has the Highlighted button type class)
    expect(searchButton).not.toHaveClass('button-highlighted');
    expect(browseButton).toHaveClass('button-highlighted');
  });

  test('calls onSegmentChange when clicking different segment', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {
            segment: 'search',
          },
        },
      },
    ]);

    render(<Segments />);

    const browseButton = screen.getByTestId('id-search-segment-button-browse');
    fireEvent.click(browseButton);

    expect(mockOnSegmentChange).toHaveBeenCalledWith('browse');
  });

  test('does not call onSegmentChange when clicking current segment', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {
            segment: 'search',
          },
        },
      },
    ]);

    render(<Segments />);

    const searchButton = screen.getByTestId('id-search-segment-button-search');
    fireEvent.click(searchButton);

    expect(mockOnSegmentChange).not.toHaveBeenCalled();
  });

  test('renders with correct role attributes', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {
            segment: 'search',
          },
        },
      },
    ]);

    render(<Segments />);

    const buttons = screen.getAllByRole('tab');
    expect(buttons).toHaveLength(2);
  });

  test('renders FormattedMessage with correct ids', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {
            segment: 'search',
          },
        },
      },
    ]);

    render(<Segments />);

    expect(screen.getByText('ld.search')).toBeInTheDocument();
    expect(screen.getByText('ld.browse')).toBeInTheDocument();
  });

  test('applies fullWidth class to ButtonGroup', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          navigationState: {
            segment: 'search',
          },
        },
      },
    ]);

    const { container } = render(<Segments />);

    const buttonGroup = container.querySelector('.search-segments');
    expect(buttonGroup).toBeInTheDocument();
  });
});
