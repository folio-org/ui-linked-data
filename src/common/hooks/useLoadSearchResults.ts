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
  const querySearchParam = searchParams.get(SearchQueryParams.Query);
  const searchBySearchParam = searchParams.get(SearchQueryParams.SearchBy);
  const prevSearchParams = useRef<{ query: string | null; searchBy: string | null }>({ query: null, searchBy: null });

  useEffect(() => {
    async function makeSearch() {
      if (searchBySearchParam) {
        setSearchBy(searchBySearchParam as SearchIdentifiers);
      }

      if (!querySearchParam) {
        setData(null);
        return;
      }

      // Sets query's value for Basic search
      if (searchBySearchParam) {
        setQuery(querySearchParam);
      }

      const { query, searchBy } = prevSearchParams.current;

      if (query !== querySearchParam || searchBy !== searchBySearchParam || forceRefresh) {
        await fetchData(querySearchParam, searchBySearchParam as SearchIdentifiers, pageNumber * SEARCH_RESULTS_LIMIT);

        setForceRefresh(false);
        prevSearchParams.current = { query: querySearchParam, searchBy: searchBySearchParam };
      }
    }

    makeSearch();
  }, [querySearchParam, searchBySearchParam, pageNumber, forceRefresh]);
};
