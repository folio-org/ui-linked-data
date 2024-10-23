import { FC, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';
import LeftIcon from '@src/assets/chevron-left.svg?react';
import RightIcon from '@src/assets/chevron-right.svg?react';
import './Pagination.scss';

export type Props = {
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  resultsCount?: number;
  totalResultsCount?: number;
  showCount?: boolean;
  onPrevPageClick: VoidFunction;
  onNextPageClick: VoidFunction;
  isLooped?: boolean;
};

export const Pagination: FC<Props> = memo(
  ({
    currentPage = 0,
    totalPages = 1,
    pageSize = 1,
    totalResultsCount = 1,
    showCount = true,
    onPrevPageClick,
    onNextPageClick,
    isLooped = false,
  }) => {
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
          type={ButtonType.Text}
          onClick={onPrevPageClick}
          disabled={!isLooped && isFirstPage}
          className="pagination-button"
          data-testid="backward-button"
        >
          <LeftIcon />
          <FormattedMessage id="ld.previous" />
        </Button>
        {showCount && (
          <div className="pagination-count">
            <FormattedMessage
              id="ld.paginationCount"
              values={{
                startCount: <span data-testid="pagination-start-count">{startCount}</span>,
                endCount: <span data-testid="pagination-end-count">{endCount}</span>,
                totalResultsCount: <span data-testid="pagination-total-count">{totalResultsCount}</span>,
              }}
            />
          </div>
        )}
        <Button
          type={ButtonType.Text}
          onClick={onNextPageClick}
          disabled={!isLooped && isDisabledNext}
          className="pagination-button"
          data-testid="forward-button"
        >
          <FormattedMessage id="ld.next" />
          <RightIcon />
        </Button>
      </div>
    );
  },
);
