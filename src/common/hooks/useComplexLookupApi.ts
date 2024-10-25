import { useSearchFiltersData } from './useSearchFiltersData';

export const useComplexLookupApi = (api: ComplexLookupApiEntryConfig, filters: SearchFilters) => {
  const { getSearchSourceData, getSearchFacetsData } = useSearchFiltersData();

  const getFacetsData = async (facet?: string, isOpen?: boolean) => {
    await getSearchFacetsData(api.endpoints.facets, facet, isOpen);
  };

  const getSourceData = async () => {
    await getSearchSourceData(api.endpoints.source, api.sourceKey);

    const openedFilter = filters.find(({ isOpen }) => isOpen);
    await getFacetsData(openedFilter?.facet);
  };

  return {
    getFacetsData,
    getSourceData,
  };
};
