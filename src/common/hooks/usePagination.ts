import { useState } from 'react';

export const usePagination = ({ totalElements = 0, totalPages = 0 }: PageMetadata, defaultPageNumber = 0) => {
  const [pageMetadata, setPageMetadata] = useState<PageMetadata>({ totalElements, totalPages });
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

  return {
    getPageMetadata,
    setPageMetadata,
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  };
};
