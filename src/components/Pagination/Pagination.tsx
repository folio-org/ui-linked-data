import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import LeftIcon from '@src/assets/chevron-left.svg?react';
import RightIcon from '@src/assets/chevron-right.svg?react';
import './Pagination.scss';
import { Button } from '@components/Button';

export type Props = {
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  resultsCount?: number;
  totalResultsCount?: number;
  onPrevPageClick: VoidFunction;
  onNextPageClick: VoidFunction;
};

export const Pagination: FC<Props> = memo(
  ({ currentPage = 0, totalPages = 1, pageSize = 1, totalResultsCount = 1, onPrevPageClick, onNextPageClick }) => {
    const isFirstPage = currentPage === 0;
    const isDisabledNext = totalPages ? currentPage === totalPages - 1 : false;
    const startCount = isFirstPage ? 1 : currentPage * pageSize + 1;
    const pageNumber = currentPage + 1;
    let endCount;

    if (totalPages === 1) {
      endCount = totalResultsCount;
    } else if (pageNumber === totalPages) {
      endCount = startCount - 1 + totalResultsCount - currentPage * pageSize;
    } else {
      endCount = pageNumber * pageSize;
    }

    return (
      <div className="pagination" data-testid="pagination">
        <Button
          onClick={onPrevPageClick}
          disabled={isFirstPage}
          className="pagination-button"
          data-testid="backward-button"
        >
          <LeftIcon />
        </Button>
        <div>
          <FormattedMessage
            id="marva.pagination-count"
            values={{
              startCount: <span data-testid="pagination-start-count">{startCount}</span>,
              endCount: <span data-testid="pagination-end-count">{endCount}</span>,
              totalResultsCount: <span data-testid="pagination-total-count">{totalResultsCount}</span>,
            }}
          />
        </div>
        <Button
          onClick={onNextPageClick}
          disabled={isDisabledNext}
          className="pagination-button"
          data-testid="forward-button"
        >
          <RightIcon />
        </Button>
      </div>
    );
  },
);
