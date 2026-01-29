import { fireEvent, render, screen } from '@testing-library/react';

import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useUIStore } from '@/store';

import { RootControls } from './RootControls';

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    mode: 'auto',
    activeUIConfig: {
      features: {
        hasSegments: true,
        hasSearchBy: true,
        hasQueryInput: true,
        hasSubmitButton: true,
        hasAdvancedSearch: true,
      },
    },
  }),
}));

jest.mock('@/assets/caret-down.svg?react', () => ({
  __esModule: true,
  default: () => <div data-testid="caret-icon">Caret</div>,
}));

jest.mock('./InputsWrapper', () => ({
  InputsWrapper: () => <div data-testid="inputs-wrapper">Inputs</div>,
}));

jest.mock('./SubmitButton', () => ({
  SubmitButton: () => <button data-testid="submit-button">Submit</button>,
}));

jest.mock('./MetaControls', () => ({
  MetaControls: () => <div data-testid="meta-controls">Meta Controls</div>,
}));

describe('RootControls', () => {
  const mockSetIsSearchPaneCollapsed = jest.fn();

  test('renders search pane when not collapsed', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const { container } = render(<RootControls />);

    expect(container.querySelector('.search-pane')).toBeInTheDocument();
  });

  test('does not render search pane when collapsed', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: true,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const { container } = render(<RootControls />);

    expect(container.querySelector('.search-pane')).not.toBeInTheDocument();
  });

  test('renders header with "Search" title by default', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls />);

    expect(screen.getByText('ld.search')).toBeInTheDocument();
  });

  test('renders header with "Search and Filter" title when showFilters is true', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls showFilters={true} />);

    expect(screen.getByText('ld.searchAndFilter')).toBeInTheDocument();
  });

  test('renders close button', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls />);

    expect(screen.getByTestId('caret-icon')).toBeInTheDocument();
  });

  test('calls setIsSearchPaneCollapsed when close button is clicked', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetIsSearchPaneCollapsed).toHaveBeenCalled();
  });

  test('renders all compound components in auto mode', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls />);

    // Note: Segments are now provided via children, not rendered in auto mode
    expect(screen.getByTestId('inputs-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('meta-controls')).toBeInTheDocument();
  });

  test('renders filters component when provided', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls showFilters={true} filtersComponent={<div data-testid="filters">Filters</div>} />);

    expect(screen.getByTestId('filters')).toBeInTheDocument();
  });

  test('does not render filters when showFilters is false', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls showFilters={false} filtersComponent={<div data-testid="filters">Filters</div>} />);

    expect(screen.queryByTestId('filters')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const { container } = render(<RootControls className="custom-class" />);

    const pane = container.querySelector('.search-pane');
    expect(pane).toHaveClass('custom-class');
  });

  test('has correct aria-labelledby attribute', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const { container } = render(<RootControls />);

    const section = container.querySelector('.search-pane');
    expect(section).toHaveAttribute('aria-labelledby', 'search-pane-header-title');
  });

  test('header title has correct id', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<RootControls />);

    const title = screen.getByText('ld.search');
    expect(title).toHaveAttribute('id', 'search-pane-header-title');
  });

  test('renders search-pane-content wrapper', () => {
    setInitialGlobalState([
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const { container } = render(<RootControls />);

    expect(container.querySelector('.search-pane-content')).toBeInTheDocument();
  });
});
