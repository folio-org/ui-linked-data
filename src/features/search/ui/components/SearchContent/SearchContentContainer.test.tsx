import { render, screen } from '@testing-library/react';
import { SearchContentContainer } from './SearchContentContainer';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';

jest.mock('../../providers', () => ({
  useSearchContext: () => ({
    uiConfig: {
      features: {
        isVisibleEmptySearchPlaceholder: true,
      },
      ui: {
        emptyStateId: 'ld.enterSearchCriteria',
      },
    },
  }),
}));

jest.mock('../SearchEmptyPlaceholder', () => ({
  SearchEmptyPlaceholder: ({ labelId, className }: { labelId?: string; className?: string }) => (
    <div data-testid="empty-placeholder" className={className}>
      {labelId}
    </div>
  ),
}));

describe('SearchContentContainer', () => {
  test('renders children when data exists', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: [{ id: '1', title: 'Test' }],
        },
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
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: null,
        },
      },
    ]);

    render(<SearchContentContainer />);

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('ld.enterSearchCriteria');
  });

  test('renders message when provided', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: null,
        },
      },
    ]);

    render(<SearchContentContainer message="ld.noResults" />);

    expect(screen.getByText('ld.noResults')).toBeInTheDocument();
  });

  test('does not render empty placeholder when message is shown', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: null,
        },
      },
    ]);

    render(<SearchContentContainer message="ld.noResults" />);

    expect(screen.queryByTestId('empty-placeholder')).not.toBeInTheDocument();
  });

  test('applies custom className to empty placeholder', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: null,
        },
      },
    ]);

    render(<SearchContentContainer emptyPlaceholderClassName="custom-empty-class" />);

    const placeholder = screen.getByTestId('empty-placeholder');
    expect(placeholder).toHaveClass('custom-empty-class');
  });

  test('renders with proper container className', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: [{ id: '1' }],
        },
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
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: null,
        },
      },
    ]);

    render(
      <SearchContentContainer>
        <div>Should Not Render</div>
      </SearchContentContainer>,
    );

    expect(screen.queryByText('Should Not Render')).not.toBeInTheDocument();
  });

  test('renders children when data is empty array', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          data: [],
        },
      },
    ]);

    render(
      <SearchContentContainer>
        <div>Empty Results</div>
      </SearchContentContainer>,
    );

    expect(screen.getByText('Empty Results')).toBeInTheDocument();
  });
});
