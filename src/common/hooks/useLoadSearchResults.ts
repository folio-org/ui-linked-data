import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { SEARCH_RESULTS_LIMIT, SearchIdentifiers } from '@common/constants/search.constants';
import { useSearchContext } from './useSearchContext';
import state from '@state';

export const useLoadSearchResults = (fetchData: ({ query, searchBy, offset }: FetchDataParams) => Promise<void>) => {
  const { hasSearchParams, defaultSearchBy, defaultQuery, getSearchSourceData, getSearchFacetsData } =
    useSearchContext();
  const setData = useSetRecoilState(state.search.data);
  const setSearchBy = useSetRecoilState(state.search.index);
  const setIsLoading = useSetRecoilState(state.loadingState.isLoading);
  const setQuery = useSetRecoilState(state.search.query);
  const [forceRefresh, setForceRefresh] = useRecoilState(state.search.forceRefresh);
  const resetFacetsData = useResetRecoilState(state.search.facetsData);
  const [searchParams] = useSearchParams();
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
        setQuery(queryParam);
      }

      await fetchData({
        query: queryParam,
        searchBy: searchByParam as SearchIdentifiers,
        offset: offsetParam ? parseInt(offsetParam) * SEARCH_RESULTS_LIMIT : 0,
      });

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

      if (getSearchSourceData) {
        await getSearchSourceData();
      }

      if (getSearchFacetsData) {
        await getSearchFacetsData();
      }

      if (defaultSearchBy && defaultQuery) {
        await fetchData({ query: defaultQuery as string, searchBy: defaultSearchBy, offset: 0 });
      }

      setIsLoading(false);
    }

    onLoad();

    return resetFacetsData;
  }, []);
};
