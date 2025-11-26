import { render, screen, fireEvent } from '@testing-library/react';
import { SearchControlPane } from './SearchControlPane';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore, useUIStore } from '@/store';

const mockSetIsSearchPaneCollapsed = jest.fn();

describe('SearchControlPane', () => {
  test('renders with label', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<SearchControlPane label="Test Label" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  test('renders with ReactElement label', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<SearchControlPane label={<div>Custom Label</div>} />);

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  test('renders children', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(
      <SearchControlPane label="Test">
        <div>Child Content</div>
      </SearchControlPane>,
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('calls setIsSearchPaneCollapsed when open button is clicked', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: true,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    render(<SearchControlPane label="Test" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetIsSearchPaneCollapsed).toHaveBeenCalledWith(false);
  });

  test('renders sublabel when showSubLabel is true and renderSubLabel is provided', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const renderSubLabel = (count: number) => <span>Total: {count}</span>;

    render(<SearchControlPane label="Test" showSubLabel={true} renderSubLabel={renderSubLabel} />);

    expect(screen.getByText('Total: 25')).toBeInTheDocument();
  });

  test('does not render sublabel when showSubLabel is false', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const renderSubLabel = (count: number) => <span>Total: {count}</span>;

    render(<SearchControlPane label="Test" showSubLabel={false} renderSubLabel={renderSubLabel} />);

    expect(screen.queryByText('Total: 25')).not.toBeInTheDocument();
  });

  test('renders custom close button', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const renderCloseButton = () => <button>Close</button>;

    render(<SearchControlPane label="Test" renderCloseButton={renderCloseButton} />);

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  test('applies embedded mode className when IS_EMBEDDED_MODE is true', () => {
    jest.resetModules();
    jest.doMock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: true }));

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const { container } = render(<SearchControlPane label="Test" />);

    const pane = container.querySelector('.search-control-pane');
    expect(pane).toBeInTheDocument();
  });

  test('does not render label section when label is not provided', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
          },
        },
      },
      {
        store: useUIStore,
        state: {
          isSearchPaneCollapsed: false,
          setIsSearchPaneCollapsed: mockSetIsSearchPaneCollapsed,
        },
      },
    ]);

    const { container } = render(<SearchControlPane />);

    const titleDiv = container.querySelector('.search-control-pane-title');
    expect(titleDiv).not.toBeInTheDocument();
  });
});
