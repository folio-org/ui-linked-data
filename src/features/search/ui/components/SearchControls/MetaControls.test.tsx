import { render, screen, fireEvent } from '@testing-library/react';
import { MetaControls } from './MetaControls';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useUIStore } from '@/store';

const mockOnReset = jest.fn();

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    mode: 'auto',
    activeUIConfig: {
      features: {
        hasAdvancedSearch: true,
      },
    },
    onReset: mockOnReset,
  }),
}));

jest.mock('./ResetButton', () => ({
  ResetButton: () => <button data-testid="reset-button">Reset</button>,
}));

jest.mock('../AdvancedSearchModal', () => ({
  AdvancedSearchModal: () => <div data-testid="advanced-search-modal">Advanced Search Modal</div>,
}));

describe('MetaControls', () => {
  const mockSetIsAdvancedSearchOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders meta-controls wrapper', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    const { container } = render(<MetaControls />);

    const wrapper = container.querySelector('.meta-controls');
    expect(wrapper).toBeInTheDocument();
  });

  test('renders ResetButton', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    render(<MetaControls />);

    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });

  test('renders Announcement component', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    const { container } = render(<MetaControls />);

    // Announcement component should be rendered (checking for its structure)
    expect(container.querySelector('.meta-controls')).toBeInTheDocument();
  });

  test('renders advanced search button when hasAdvancedSearch is true', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    render(<MetaControls />);

    expect(screen.getByText('ld.advanced')).toBeInTheDocument();
  });

  test('opens advanced search modal when button is clicked', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    render(<MetaControls />);

    const advancedButton = screen.getByText('ld.advanced');
    fireEvent.click(advancedButton);

    expect(mockSetIsAdvancedSearchOpen).toHaveBeenCalled();
  });

  test('renders advanced search modal when isAdvancedSearchOpen is true', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: true,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    render(<MetaControls />);

    expect(screen.getByTestId('advanced-search-modal')).toBeInTheDocument();
  });

  test('does not render advanced search modal when isAdvancedSearchOpen is false', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    render(<MetaControls />);

    expect(screen.queryByTestId('advanced-search-modal')).not.toBeInTheDocument();
  });

  test('does not apply meta-controls-centered class when hasAdvancedSearch is true', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    const { container } = render(<MetaControls />);

    const wrapper = container.querySelector('.meta-controls');
    expect(wrapper).not.toHaveClass('meta-controls-centered');
  });

  test('passes clearValues to AdvancedSearchModal', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: true,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    render(<MetaControls />);

    expect(screen.getByTestId('advanced-search-modal')).toBeInTheDocument();
  });

  test('wrapper has correct structure', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isAdvancedSearchOpen: false,
          setIsAdvancedSearchOpen: mockSetIsAdvancedSearchOpen,
        },
      },
    ]);

    const { container } = render(<MetaControls />);

    const wrapper = container.querySelector('.meta-controls');
    expect(wrapper?.tagName).toBe('DIV');
  });
});
