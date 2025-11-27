import { render, screen } from '@testing-library/react';
import { SearchPagination } from './SearchPagination';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';

const mockOnPageChange = jest.fn();

jest.mock('../../providers/SearchProvider', () => ({
  useSearchContext: () => ({
    onPageChange: mockOnPageChange,
  }),
}));

interface MockPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
}

jest.mock('@/components/Pagination', () => ({
  Pagination: ({ currentPage, totalPages, onPrevPageClick, onNextPageClick }: MockPaginationProps) => (
    <div data-testid="pagination">
      <button onClick={onPrevPageClick}>Previous</button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button onClick={onNextPageClick}>Next</button>
    </div>
  ),
}));

describe('SearchPagination', () => {
  test('renders pagination when data exists', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
            totalPages: 3,
          },
          navigationState: {
            offset: 0,
          },
        },
      },
    ]);

    render(<SearchPagination />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  test('does not render when pageMetadata is null', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: null,
          navigationState: {
            offset: 0,
          },
        },
      },
    ]);

    const { container } = render(<SearchPagination />);

    expect(container).toBeEmptyDOMElement();
  });

  test('does not render when totalElements is 0', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 0,
            totalPages: 0,
          },
          navigationState: {
            offset: 0,
          },
        },
      },
    ]);

    const { container } = render(<SearchPagination />);

    expect(container).toBeEmptyDOMElement();
  });

  test('calculates current page from offset correctly', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 50,
            totalPages: 5,
          },
          navigationState: {
            offset: 20, // 20 / 10 = page 2 (0-indexed)
          },
        },
      },
    ]);

    render(<SearchPagination />);

    expect(screen.getByText('Page 3 of 5')).toBeInTheDocument();
  });

  test('calls onPageChange when next button is clicked', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
            totalPages: 3,
          },
          navigationState: {
            offset: 0,
          },
        },
      },
    ]);

    render(<SearchPagination />);

    const nextButton = screen.getByText('Next');
    nextButton.click();

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange when previous button is clicked', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
            totalPages: 3,
          },
          navigationState: {
            offset: 10,
          },
        },
      },
    ]);

    render(<SearchPagination />);

    const prevButton = screen.getByText('Previous');
    prevButton.click();

    expect(mockOnPageChange).toHaveBeenCalledWith(0);
  });

  test('renders with custom showCount prop', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
            totalPages: 3,
          },
          navigationState: {
            offset: 0,
          },
        },
      },
    ]);

    render(<SearchPagination showCount={false} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('renders with custom isLooped prop', () => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          pageMetadata: {
            totalElements: 25,
            totalPages: 3,
          },
          navigationState: {
            offset: 0,
          },
        },
      },
    ]);

    render(<SearchPagination isLooped={true} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
