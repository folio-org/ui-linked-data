import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import state from '@state';

export const usePagination = (hasSearchParams = true, defaultPageNumber = 0) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const offsetSearchParam = searchParams.get(SearchQueryParams.Offset);
  const pageMetadata = useRecoilValue<PageMetadata>(state.search.pageMetadata);
  const [currentPageNumber, setCurrentPageNumber] = useState(
    offsetSearchParam ? parseInt(offsetSearchParam) : defaultPageNumber,
  );

  useEffect(() => {
    if (offsetSearchParam === (undefined || null)) return;

    setCurrentPageNumber(parseInt(offsetSearchParam));
  }, [offsetSearchParam]);

  const getCurrentPageNumber = () => currentPageNumber;

  const onPrevPageClick = () => {
    const prevPageNumber = currentPageNumber - 1;

    if (prevPageNumber < 0) return;

    setCurrentPageNumber(prevPageNumber);

    if (hasSearchParams) {
      setSearchParams(searchParams => {
        searchParams.set(SearchQueryParams.Offset, prevPageNumber.toString());

        return searchParams;
      });
    }
  };

  const onNextPageClick = () => {
    const nextPageNumber = currentPageNumber + 1;

    if (nextPageNumber > pageMetadata.totalPages - 1) return;

    setCurrentPageNumber(nextPageNumber);

    if (hasSearchParams) {
      setSearchParams(searchParams => {
        searchParams.set(SearchQueryParams.Offset, nextPageNumber.toString());

        return searchParams;
      });
    }
  };

  return {
    getCurrentPageNumber,
    setCurrentPageNumber,
    onPrevPageClick,
    onNextPageClick,
  };
};
