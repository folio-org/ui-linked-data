import { render, screen } from '@testing-library/react';
import { SearchContentContainer } from './SearchContentContainer';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import * as SearchProvider from '../../providers';

const mockUseSearchContext = (overrides = {}) => {
  jest.spyOn(SearchProvider, 'useSearchContext').mockReturnValue({
    flow: 'url',
    mode: 'custom' as const,
    config: {},
    uiConfig: {
      features: {
        isVisibleEmptySearchPlaceholder: true,
      },
      ui: {
        emptyStateId: 'ld.enterSearchCriteria',
      },
    },
    activeUIConfig: {},
    results: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    onPageChange: jest.fn(),
    onSegmentChange: jest.fn(),
    onSourceChange: jest.fn(),
    onSubmit: jest.fn(),
    onReset: jest.fn(),
    ...overrides,
  } as never);
};

jest.mock('../../providers');

jest.mock('../SearchEmptyPlaceholder', () => ({
  SearchEmptyPlaceholder: ({ labelId, className }: { labelId?: string; className?: string }) => (
    <div data-testid="empty-placeholder" className={className}>
      {labelId}
    </div>
  ),
}));

describe('SearchContentContainer', () => {
  beforeEach(() => {
    mockUseSearchContext();
  });

  test('renders children when data exists', () => {
    mockUseSearchContext({
      results: { items: [{ id: '1', title: 'Test' }], totalRecords: 1 },
    });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    render(
      <SearchContentContainer>
        <div>Search Results</div>
      </SearchContentContainer>,
    );

    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  test('renders empty placeholder when no data and no message', () => {
    mockUseSearchContext({ results: undefined });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    render(<SearchContentContainer />);

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('ld.enterSearchCriteria');
  });

  test('renders message when provided', () => {
    mockUseSearchContext({ results: undefined });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    render(<SearchContentContainer message="ld.noResults" />);

    expect(screen.getByText('ld.noResults')).toBeInTheDocument();
  });

  test('does not render empty placeholder when message is shown', () => {
    mockUseSearchContext({ results: undefined });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    render(<SearchContentContainer message="ld.noResults" />);

    expect(screen.queryByTestId('empty-placeholder')).not.toBeInTheDocument();
  });

  test('applies custom className to empty placeholder', () => {
    mockUseSearchContext({ results: undefined });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    render(<SearchContentContainer emptyPlaceholderClassName="custom-empty-class" />);

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toHaveClass('custom-empty-class');
  });

  test('renders with proper container className', () => {
    mockUseSearchContext({
      results: { items: [{ id: '1' }], totalRecords: 1 },
    });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    const { container } = render(
      <SearchContentContainer>
        <div>Content</div>
      </SearchContentContainer>,
    );

    const contentContainer = container.querySelector('.item-search-content-container');
    expect(contentContainer).toBeInTheDocument();
  });

  test('does not render children when no data', () => {
    mockUseSearchContext({ results: undefined });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    render(
      <SearchContentContainer>
        <div>Should Not Render</div>
      </SearchContentContainer>,
    );

    expect(screen.queryByText('Should Not Render')).not.toBeInTheDocument();
  });

  test('renders empty placeholder when data is empty array', () => {
    mockUseSearchContext({
      results: { items: [], totalRecords: 0 },
    });

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {},
      },
    ]);

    render(
      <SearchContentContainer>
        <div>Should Not Render</div>
      </SearchContentContainer>,
    );

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(screen.queryByText('Should Not Render')).not.toBeInTheDocument();
  });
});
