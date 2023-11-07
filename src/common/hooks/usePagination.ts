import { useState } from 'react';

type PageMetadata = {
  number: number;
  totalElements: number;
  totalPages: number;
};

export const usePagination = (
  { number = 0, totalElements = 0, totalPages = 0 }: PageMetadata,
  defaultPageNumber = 0,
) => {
  const [pageMetadata, setPageMetadata] = useState<PageMetadata>({ number, totalElements, totalPages });
  const [currentPageNumber, setCurrentPageNumber] = useState(defaultPageNumber);

  const getPageMetadata = () => pageMetadata;

  const getCurrentPageNumber = () => currentPageNumber;

  const onPrevPageClick = () => {
    const prevPageNumber = currentPageNumber - 1;

    if (prevPageNumber < 0) return;

    setCurrentPageNumber(prevPageNumber);
  };

  const onNextPageClick = () => {
    const nextPageNumber = currentPageNumber + 1;

    if (nextPageNumber > pageMetadata.totalPages - 1) return;

    setCurrentPageNumber(nextPageNumber);
  };

  return { getPageMetadata, setPageMetadata, getCurrentPageNumber, onPrevPageClick, onNextPageClick };
};