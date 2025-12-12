import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchPagination } from './SearchPagination';
import * as SearchProvider from '../../providers/SearchProvider';
import * as UseCommittedSearchParams from '../../hooks/useCommittedSearchParams';

const mockOnPageChange = jest.fn();

const mockUseSearchContext = (overrides = {}) => {
  jest.spyOn(SearchProvider, 'useSearchContext').mockReturnValue({
    onPageChange: mockOnPageChange,
    results: { items: [], totalRecords: 25, pageMetadata: { totalElements: 25, totalPages: 3 } },
    flow: 'url',
    mode: 'custom' as const,
    config: { defaults: { limit: 10 } },
    uiConfig: {},
    activeUIConfig: {},
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    onSegmentChange: jest.fn(),
    onSourceChange: jest.fn(),
    onSubmit: jest.fn(),
    onReset: jest.fn(),
    ...overrides,
  } as never);
};

const mockUseCommittedSearchParams = (overrides = {}) => {
  jest.spyOn(UseCommittedSearchParams, 'useCommittedSearchParams').mockReturnValue({
    offset: 0,
    query: '',
    searchBy: 'keyword',
    ...overrides,
  });
};

jest.mock('../../providers/SearchProvider');
jest.mock('../../hooks/useCommittedSearchParams');

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
  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test('renders pagination when data exists', () => {
    mockUseSearchContext();
    mockUseCommittedSearchParams();

    renderWithRouter(<SearchPagination />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  test('does not render when pageMetadata is null', () => {
    mockUseSearchContext({ results: { items: [], totalRecords: 0, pageMetadata: null } });
    mockUseCommittedSearchParams();

    const { container } = renderWithRouter(<SearchPagination />);

    expect(container).toBeEmptyDOMElement();
  });

  test('does not render when totalElements is 0', () => {
    mockUseSearchContext({
      results: { items: [], totalRecords: 0, pageMetadata: { totalElements: 0, totalPages: 0 } },
    });
    mockUseCommittedSearchParams();

    const { container } = renderWithRouter(<SearchPagination />);

    expect(container).toBeEmptyDOMElement();
  });

  test('calculates current page from offset correctly', () => {
    mockUseSearchContext({
      results: { items: [], totalRecords: 50, pageMetadata: { totalElements: 50, totalPages: 5 } },
    });
    mockUseCommittedSearchParams({ offset: 20 });

    renderWithRouter(<SearchPagination />);

    expect(screen.getByText('Page 3 of 5')).toBeInTheDocument();
  });

  test('calls onPageChange when next button is clicked', () => {
    mockUseSearchContext();
    mockUseCommittedSearchParams({ offset: 0 });

    renderWithRouter(<SearchPagination />);

    const nextButton = screen.getByText('Next');
    nextButton.click();

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange when previous button is clicked', () => {
    mockUseSearchContext();
    mockUseCommittedSearchParams({ offset: 10 });

    renderWithRouter(<SearchPagination />);

    const prevButton = screen.getByText('Previous');
    prevButton.click();

    expect(mockOnPageChange).toHaveBeenCalledWith(0);
  });

  test('renders with custom showCount prop', () => {
    mockUseSearchContext();
    mockUseCommittedSearchParams();

    renderWithRouter(<SearchPagination showCount={false} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('renders with custom isLooped prop', () => {
    mockUseSearchContext();
    mockUseCommittedSearchParams();

    renderWithRouter(<SearchPagination isLooped={true} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
