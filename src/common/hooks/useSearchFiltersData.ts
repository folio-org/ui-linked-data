import { useRecoilState, useSetRecoilState } from 'recoil';
import * as SearchApi from '@common/api/search.api';
import state from '@state';

export const useSearchFiltersData = () => {
  const [selectedFacetsGroups, setSelectedFacetsGroups] = useRecoilState(state.search.selectedFacetsGroups);
  const setFacetsData = useSetRecoilState(state.search.facetsData);
  const setSourceData = useSetRecoilState(state.search.sourceData);

  const getUpdatedSelectedFacetsGroups = (facet?: string) => {
    if (!facet) return selectedFacetsGroups;

    if (selectedFacetsGroups?.includes(facet)) return selectedFacetsGroups;

    return selectedFacetsGroups ? [...selectedFacetsGroups, facet] : [facet];
  };

  const getSearchSourceData = async (url?: string) => {
    if (!url) return;

    try {
      const response = await SearchApi.getSearchSourceData(url);

      setSourceData(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getSearchFacetsData = async (url?: string, facet?: string) => {
    if (!url || !facet) return;

    const updatedSelectedFacetsGroups = getUpdatedSelectedFacetsGroups(facet);

    setSelectedFacetsGroups(updatedSelectedFacetsGroups);

    try {
      const facetsQueryParam = updatedSelectedFacetsGroups.join(',');
      // TODO: generate query by selected values
      const query = 'id=*';
      const response = await SearchApi.getFacets(url, { facet: facetsQueryParam, query });

      setFacetsData(response.facets);
    } catch (error) {
      console.error(error);
    }
  };

  return { getSearchSourceData, getSearchFacetsData };
};
