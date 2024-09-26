import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import state from '@state';
import { useSearchFiltersData } from './useSearchFiltersData';

export const useComplexLookupApi = (api: ComplexLookupApiEntryConfig, filters: SearchFilters, isOpen: boolean) => {
  const setFacetsData = useSetRecoilState(state.search.facetsData);
  const { getSearchSourceData, getSearchFacetsData } = useSearchFiltersData();

  const getFacetsData = async (facet?: string, isOpen?: boolean) => {
    await getSearchFacetsData(api.endpoints.facets, facet, isOpen);
  };

  const getSourceData = async () => {
    await getSearchSourceData(api.endpoints.source, api.sourceKey);

    const openedFilter = filters.find(({ isOpen }) => isOpen);
    await getFacetsData(openedFilter?.facet);
  };

  useEffect(() => {
    if (!isOpen || !api.endpoints.source) return;

    getSourceData();

    return () => {
      setFacetsData({});
    };
  }, [isOpen]);

  return {
    getFacetsData,
    getSourceData,
  };
};
