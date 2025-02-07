import { Pagination } from '@components/Pagination';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Pagination', () => {
  const onPrevPageClick = jest.fn();
  const onNextPageClick = jest.fn();
  const props = { onPrevPageClick, onNextPageClick };

  const { getByTestId } = screen;

  test('renders Pagination component', () => {
    render(<Pagination {...props} currentPage={0} totalPages={2} />);

    expect(getByTestId('pagination')).toBeInTheDocument();
  });

  describe('counts', () => {
    type PaginationProps = {
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalResultsCount: number;
      useSlidingWindow?: boolean;
    };
    type ResultCounts = {
      start: number;
      end: number;
      total: number;
    };

    function testPaginationCounts(
      { currentPage, totalPages, pageSize, totalResultsCount, useSlidingWindow = false }: PaginationProps,
      { start, end, total }: ResultCounts,
    ) {
      render(
        <Pagination
          {...props}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalResultsCount={totalResultsCount}
          useSlidingWindow={useSlidingWindow}
        />,
      );

      expect(getByTestId('pagination-start-count').textContent).toBe(start.toString());
      expect(getByTestId('pagination-end-count').textContent).toBe(end.toString());
      expect(getByTestId('pagination-total-count').textContent).toBe(total.toString());
    }

    test('renders the correct count for the only page', () => {
      testPaginationCounts(
        { currentPage: 0, totalPages: 1, pageSize: 5, totalResultsCount: 5 },
        { start: 1, end: 5, total: 5 },
      );
    });

    test('renders the correct count for the first page of three', () => {
      testPaginationCounts(
        { currentPage: 0, totalPages: 3, pageSize: 5, totalResultsCount: 12 },
        { start: 1, end: 5, total: 12 },
      );
    });

    test('renders the correct count for the second page of three', () => {
      testPaginationCounts(
        { currentPage: 1, totalPages: 3, pageSize: 5, totalResultsCount: 12 },
        { start: 6, end: 10, total: 12 },
      );
    });

    test('renders the correct count for the last page', () => {
      testPaginationCounts(
        { currentPage: 2, totalPages: 3, pageSize: 5, totalResultsCount: 12 },
        { start: 11, end: 12, total: 12 },
      );
    });

    describe('counts with sliding window', () => {
      test('renders the correct count for the first sliding window page', () => {
        testPaginationCounts(
          { currentPage: 0, totalPages: 2, pageSize: 2, totalResultsCount: 4, useSlidingWindow: true },
          { start: 1, end: 2, total: 4 },
        );
      });

      test('renders the correct count after clicking next on the first page', () => {
        testPaginationCounts(
          { currentPage: 1, totalPages: 3, pageSize: 2, totalResultsCount: 4, useSlidingWindow: true },
          { start: 2, end: 3, total: 4 },
        );
      });

      test('renders the correct count for the last sliding window page', () => {
        testPaginationCounts(
          { currentPage: 2, totalPages: 3, pageSize: 2, totalResultsCount: 4, useSlidingWindow: true },
          { start: 3, end: 4, total: 4 },
        );
      });
    });
  });

  test('backward button is disabled and forward button is enabled', () => {
    render(<Pagination {...props} currentPage={0} totalPages={2} />);

    expect(getByTestId('backward-button')).toBeDisabled();
    expect(getByTestId('forward-button')).not.toBeDisabled();
  });

  test('forward button is disabled and backward button is enabled', () => {
    render(<Pagination {...props} currentPage={1} totalPages={2} />);

    expect(getByTestId('forward-button')).toBeDisabled();
    expect(getByTestId('backward-button')).not.toBeDisabled();
  });

  test('calls onPrevPageClick handler', () => {
    render(<Pagination {...props} currentPage={1} totalPages={2} />);

    fireEvent.click(getByTestId('backward-button'));

    expect(onPrevPageClick).toHaveBeenCalled();
  });

  test('calls onNextPageClick handler', () => {
    render(<Pagination {...props} currentPage={0} totalPages={2} />);

    fireEvent.click(getByTestId('forward-button'));

    expect(onNextPageClick).toHaveBeenCalled();
  });
});
