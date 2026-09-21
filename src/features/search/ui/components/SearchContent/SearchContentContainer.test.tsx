import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import * as SearchHooks from '../../hooks';
import * as SearchProvider from '../../providers';
import { SearchContentContainer } from './SearchContentContainer';

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

const mockUseCommittedSearchParams = (query = '') => {
  jest.spyOn(SearchHooks, 'useCommittedSearchParams').mockReturnValue({
    query,
    offset: 0,
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
    mockUseCommittedSearchParams();
  });

  test('renders children when data exists', () => {
    mockUseSearchContext({
      results: { items: [{ id: '1', title: 'Test' }], totalRecords: 1 },
    });
    mockUseCommittedSearchParams('test query');

    render(
      <MemoryRouter>
        <SearchContentContainer>
          <div>Search Results</div>
        </SearchContentContainer>
      </MemoryRouter>,
    );

    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  test('renders empty placeholder when no data and no message', () => {
    mockUseSearchContext({ results: undefined });
    mockUseCommittedSearchParams('');

    render(
      <MemoryRouter>
        <SearchContentContainer />
      </MemoryRouter>,
    );

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('ld.enterSearchCriteria');
  });

  test('renders message when provided', () => {
    mockUseSearchContext({ results: undefined });
    mockUseCommittedSearchParams('');

    render(
      <MemoryRouter>
        <SearchContentContainer message="ld.noResults" />
      </MemoryRouter>,
    );

    expect(screen.getByText('ld.noResults')).toBeInTheDocument();
  });

  test('does not render empty placeholder when message is shown', () => {
    mockUseSearchContext({ results: undefined });
    mockUseCommittedSearchParams('');

    render(
      <MemoryRouter>
        <SearchContentContainer message="ld.noResults" />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('empty-placeholder')).not.toBeInTheDocument();
  });

  test('applies custom className to empty placeholder', () => {
    mockUseSearchContext({ results: undefined });
    mockUseCommittedSearchParams('');

    render(
      <MemoryRouter>
        <SearchContentContainer emptyPlaceholderClassName="custom-empty-class" />
      </MemoryRouter>,
    );

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toHaveClass('custom-empty-class');
  });

  test('renders with proper container className', () => {
    mockUseSearchContext({
      results: { items: [{ id: '1' }], totalRecords: 1 },
    });
    mockUseCommittedSearchParams('test query');

    const { container } = render(
      <MemoryRouter>
        <SearchContentContainer>
          <div>Content</div>
        </SearchContentContainer>
      </MemoryRouter>,
    );

    const contentContainer = container.querySelector('.item-search-content-container');
    expect(contentContainer).toBeInTheDocument();
  });

  test('does not render children when no data', () => {
    mockUseSearchContext({ results: undefined });
    mockUseCommittedSearchParams('');

    render(
      <MemoryRouter>
        <SearchContentContainer>
          <div>Should Not Render</div>
        </SearchContentContainer>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Should Not Render')).not.toBeInTheDocument();
  });

  test('renders empty placeholder when data is empty array', () => {
    mockUseSearchContext({
      results: { items: [], totalRecords: 0 },
    });
    mockUseCommittedSearchParams('');

    render(
      <MemoryRouter>
        <SearchContentContainer>
          <div>Should Not Render</div>
        </SearchContentContainer>
      </MemoryRouter>,
    );

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(screen.queryByText('Should Not Render')).not.toBeInTheDocument();
  });

  interface AccessibilityVariant {
    context: Record<string, unknown>;
    query: string;
    children?: React.ReactNode;
    message?: string;
    emptyPlaceholderClassName?: string;
  }

  describe('accessibility', () => {
    test.each([
      [
        'data exists',
        {
          context: { results: { items: [{ id: '1', title: 'Test' }], totalRecords: 1 } },
          query: 'test query',
          children: <div>Search Results</div>,
        },
      ],
      ['no data and no message', { context: { results: undefined }, query: '' }],
      ['message provided', { context: { results: undefined }, query: '', message: 'ld.noResults' }],
      [
        'custom empty placeholder className',
        { context: { results: undefined }, query: '', emptyPlaceholderClassName: 'custom-empty-class' },
      ],
      [
        'empty array data',
        {
          context: { results: { items: [], totalRecords: 0 } },
          query: '',
          children: <div>Should Not Render</div>,
        },
      ],
    ] as [string, AccessibilityVariant][])(
      'has no accessibility violations when %s',
      async (_description, { context, query, children, message, emptyPlaceholderClassName }) => {
        mockUseSearchContext(context);
        mockUseCommittedSearchParams(query);

        const { container } = render(
          <MemoryRouter>
            <SearchContentContainer message={message} emptyPlaceholderClassName={emptyPlaceholderClassName}>
              {children}
            </SearchContentContainer>
          </MemoryRouter>,
        );

        const results = await axe(container);

        expect(results).toHaveNoViolations();
      },
    );
  });
});
