import { SearchQueryParams } from '@common/constants/routes.constants';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePagination = ({ totalElements = 0, totalPages = 0 }: PageMetadata, defaultPageNumber = 0) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const offsetSearchParam = searchParams.get(SearchQueryParams.Offset);
  const [pageMetadata, setPageMetadata] = useState<PageMetadata>({ totalElements, totalPages });
  const [currentPageNumber, setCurrentPageNumber] = useState(
    offsetSearchParam ? parseInt(offsetSearchParam) : defaultPageNumber,
  );

  useEffect(() => {
    if (offsetSearchParam === (undefined || null)) return;

    setCurrentPageNumber(parseInt(offsetSearchParam));
  }, [offsetSearchParam]);

  const getPageMetadata = () => pageMetadata;

  const getCurrentPageNumber = () => currentPageNumber;

  const onPrevPageClick = () => {
    const prevPageNumber = currentPageNumber - 1;

    if (prevPageNumber < 0) return;

    setCurrentPageNumber(prevPageNumber);
    setSearchParams(searchParams => {
      searchParams.set(SearchQueryParams.Offset, prevPageNumber.toString());

      return searchParams;
    });
  };

  const onNextPageClick = () => {
    const nextPageNumber = currentPageNumber + 1;

    if (nextPageNumber > pageMetadata.totalPages - 1) return;

    setCurrentPageNumber(nextPageNumber);
    setSearchParams(searchParams => {
      searchParams.set(SearchQueryParams.Offset, nextPageNumber.toString());

      return searchParams;
    });
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
