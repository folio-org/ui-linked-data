import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import state from '@state';

export const useLoadSearchResults = (
  fetchData: (query: string, searchBy?: SearchIdentifiers, offset?: number) => Promise<void>,
  pageNumber = 0,
) => {
  const setData = useSetRecoilState(state.search.data);
  const setSearchBy = useSetRecoilState(state.search.index);
  const setQuery = useSetRecoilState(state.search.query);
  const [forceRefresh, setForceRefresh] = useRecoilState(state.search.forceRefresh);
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get(SearchQueryParams.Query);
  const searchByParam = searchParams.get(SearchQueryParams.SearchBy);
  const prevSearchParams = useRef<{ query: string | null; searchBy: string | null }>({ query: null, searchBy: null });
  const prevPageNumber = useRef(pageNumber);

  useEffect(() => {
    async function makeSearch() {
      const { query: prevQuery, searchBy: prevSearchBy } = prevSearchParams.current;

      if (
        prevQuery === queryParam &&
        prevSearchBy === searchByParam &&
        prevPageNumber.current === pageNumber &&
        !forceRefresh
      )
        return;

      if (searchByParam && prevSearchBy !== searchByParam) {
        setSearchBy(searchByParam as SearchIdentifiers);
      }

      if (!queryParam) {
        setData(null);
        return;
      }

      // Sets query's value for Basic search
      if (searchByParam && prevQuery !== queryParam) {
        setQuery(queryParam);
      }

      await fetchData(queryParam, searchByParam as SearchIdentifiers, pageNumber * SEARCH_RESULTS_LIMIT);

      setForceRefresh(false);
      prevSearchParams.current = { query: queryParam, searchBy: searchByParam };
      prevPageNumber.current = pageNumber;
    }

    makeSearch();
  }, [queryParam, searchByParam, pageNumber, forceRefresh]);
};
