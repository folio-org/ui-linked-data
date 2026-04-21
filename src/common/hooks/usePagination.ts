import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SearchQueryParams } from '@/common/constants/routes.constants';

import { useSearchState } from '@/store';

export const usePagination = (hasSearchParams = true, defaultPageNumber = 0, hasCycledPagination = false) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const offsetSearchParam = searchParams.get(SearchQueryParams.Offset);
  const { pageMetadata } = useSearchState(['pageMetadata']);
  const [currentPageNumber, setCurrentPageNumber] = useState(
    offsetSearchParam ? parseInt(offsetSearchParam) : defaultPageNumber,
  );

  useEffect(() => {
    if (offsetSearchParam === undefined || offsetSearchParam === null) return;

    setCurrentPageNumber(parseInt(offsetSearchParam));
  }, [offsetSearchParam]);

  const getCurrentPageNumber = () => currentPageNumber;

  const onPrevPageClick = () => {
    const prevPageNumber = currentPageNumber - 1;

    if (!hasCycledPagination && prevPageNumber < 0) return prevPageNumber;

    setCurrentPageNumber(prevPageNumber);

    if (hasSearchParams) {
      setSearchParams(searchParams => {
        searchParams.set(SearchQueryParams.Offset, prevPageNumber.toString());

        return searchParams;
      });
    }

    return prevPageNumber;
  };

  const onNextPageClick = () => {
    const nextPageNumber = currentPageNumber + 1;

    if (!hasCycledPagination && nextPageNumber > pageMetadata.totalPages - 1) return nextPageNumber;

    setCurrentPageNumber(nextPageNumber);

    if (hasSearchParams) {
      setSearchParams(searchParams => {
        searchParams.set(SearchQueryParams.Offset, nextPageNumber.toString());

        return searchParams;
      });
    }

    return nextPageNumber;
  };

  return {
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  };
};
