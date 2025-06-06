import { useEffect, useRef } from 'react';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import { removeBackslashes } from '@common/helpers/search.helper';
import { useLoadingState, useSearchState } from '@src/store';
import { useSearchContext } from './useSearchContext';

export const useLoadSearchResults = (
  fetchData: ({ query, searchBy, offset, selectedSegment, baseQuerySelector }: FetchDataParams) => Promise<void>,
) => {
  const { hasSearchParams, defaultSearchBy, defaultQuery, getSearchSourceData, getSearchFacetsData } =
    useSearchContext();
  const { setIsLoading } = useLoadingState();
  const { setQuery, setData, setSearchBy, forceRefresh, setForceRefresh, resetFacetsData } = useSearchState();
  const searchParams = new URLSearchParams(window.location.search);
  const queryParam = searchParams.get(SearchQueryParams.Query);
  const searchByParam = searchParams.get(SearchQueryParams.SearchBy);
  const offsetParam = searchParams.get(SearchQueryParams.Offset);
  const prevSearchParams = useRef<{ query: string | null; searchBy: string | null; offset: string | number | null }>({
    query: null,
    searchBy: null,
    offset: null,
  });

  useEffect(() => {
    if (!hasSearchParams) return;

    async function makeSearch() {
      const { query: prevQuery, searchBy: prevSearchBy, offset: prevOffset } = prevSearchParams.current;

      if (prevQuery === queryParam && prevSearchBy === searchByParam && prevOffset === offsetParam && !forceRefresh)
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
        setQuery(removeBackslashes(queryParam));
      }

      setForceRefresh(false);
      prevSearchParams.current = { query: queryParam, searchBy: searchByParam, offset: offsetParam };
    }

    makeSearch();
  }, [hasSearchParams, queryParam, searchByParam, offsetParam, forceRefresh]);

  // Load source, facets data and search results when the Search module is loaded with the default "Search By" and "Query" values.
  // This is used for Complex Lookup field if it has the selected value.
  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);

      await getSearchSourceData?.();
      await getSearchFacetsData?.();

      const query = hasSearchParams ? queryParam : defaultQuery;
      const searchBy = hasSearchParams ? searchByParam : defaultSearchBy;
      const offset = offsetParam ? parseInt(offsetParam) * SEARCH_RESULTS_LIMIT : 0;

      if (searchByParam) {
        setSearchBy(searchByParam);
      }

      if (searchByParam && queryParam) {
        setQuery(removeBackslashes(queryParam));
      }

      if (query) {
        await fetchData({ query, searchBy, offset });
      }

      setIsLoading(false);
    }

    onLoad();

    return resetFacetsData;
  }, []);
};
