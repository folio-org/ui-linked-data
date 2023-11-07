import { FC } from 'react';
import LeftIcon from '@src/assets/chevron-left.svg?react';
import RightIcon from '@src/assets/chevron-right.svg?react';
import './Pagination.scss';

type Props = {
  currentPage?: number;
  totalPages?: number;
  onPrevPageClick: VoidFunction;
  onNextPageClick: VoidFunction;
};

export const Pagination: FC<Props> = ({ currentPage, totalPages, onPrevPageClick, onNextPageClick }) => {
  const isDisabledPrev = currentPage === 0;
  const isDisabledNext = totalPages ? currentPage === totalPages - 1 : false;

  return (
    <div className="pagination">
      <button onClick={onPrevPageClick} disabled={isDisabledPrev} className="pagination-button">
        <LeftIcon />
      </button>
      <button onClick={onNextPageClick} disabled={isDisabledNext} className="pagination-button">
        <RightIcon />
      </button>
    </div>
  );
};
