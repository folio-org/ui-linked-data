import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import state from '@state';
import { normalizeQuery } from '@common/helpers/search.helper';

export const useLoadSearchResults = (
  fetchData: (query: string, searchBy: SearchIdentifiers, offset?: number) => Promise<void>,
  { query, searchBy, offset }: { query?: string; searchBy?: SearchIdentifiers; offset?: string },
) => {
  const setData = useSetRecoilState(state.search.data);
  const setSearchBy = useSetRecoilState(state.search.index);
  const setQuery = useSetRecoilState(state.search.query);
  const [forceRefresh, setForceRefresh] = useRecoilState(state.search.forceRefresh);
  const [searchParams] = useSearchParams();
  const queryParam = query ?? searchParams.get(SearchQueryParams.Query);
  const searchByParam = searchBy ?? searchParams.get(SearchQueryParams.SearchBy);
  const offsetParam = offset ?? searchParams.get(SearchQueryParams.Offset);
  const prevSearchParams = useRef<{ query: string | null; searchBy: string | null; offset: string | null }>({
    query: null,
    searchBy: null,
    offset: null,
  });

  const normalizedQueryParam = searchByParam ? normalizeQuery(queryParam) : queryParam;

  useEffect(() => {
    async function makeSearch() {
      const { query: prevQuery, searchBy: prevSearchBy, offset: prevOffset } = prevSearchParams.current;

      if (prevQuery === queryParam && prevSearchBy === searchByParam && prevOffset === offsetParam && !forceRefresh)
        return;

      if (searchByParam && prevSearchBy !== searchByParam) {
        setSearchBy(searchByParam as SearchIdentifiers);
      }

      if (!queryParam || !normalizedQueryParam) {
        setData(null);
        return;
      }

      // Sets query's value for Basic search
      if (searchByParam && prevQuery !== queryParam) {
        setQuery(queryParam);
      }

      await fetchData(
        normalizedQueryParam,
        searchByParam as SearchIdentifiers,
        offsetParam ? parseInt(offsetParam) * SEARCH_RESULTS_LIMIT : 0,
      );

      setForceRefresh(false);
      prevSearchParams.current = { query: queryParam, searchBy: searchByParam, offset: offsetParam };
    }

    makeSearch();
  }, [queryParam, searchByParam, offsetParam, forceRefresh]);
};
