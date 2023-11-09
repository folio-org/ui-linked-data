import { FC, memo } from 'react';
import LeftIcon from '@src/assets/chevron-left.svg?react';
import RightIcon from '@src/assets/chevron-right.svg?react';
import './Pagination.scss';

export type Props = {
  currentPage?: number;
  totalPages?: number;
  onPrevPageClick: VoidFunction;
  onNextPageClick: VoidFunction;
};

export const Pagination: FC<Props> = memo(({ currentPage = 0, totalPages = 0, onPrevPageClick, onNextPageClick }) => {
  const isDisabledPrev = currentPage === 0;
  const isDisabledNext = totalPages ? currentPage === totalPages - 1 : false;

  return (
    <div className="pagination" data-testid="pagination">
      <button
        onClick={onPrevPageClick}
        disabled={isDisabledPrev}
        className="pagination-button"
        data-testid="backward-button"
      >
        <LeftIcon />
      </button>
      <button
        onClick={onNextPageClick}
        disabled={isDisabledNext}
        className="pagination-button"
        data-testid="forward-button"
      >
        <RightIcon />
      </button>
    </div>
  );
});
