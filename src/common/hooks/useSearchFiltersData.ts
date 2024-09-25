import { useRecoilState, useSetRecoilState } from 'recoil';
import * as SearchApi from '@common/api/search.api';
import state from '@state';
import { useEffect } from 'react';

export const useSearchFiltersData = () => {
  const [selectedFacetsGroups, setSelectedFacetsGroups] = useRecoilState(state.search.selectedFacetsGroups);
  const setFacetsData = useSetRecoilState(state.search.facetsData);
  const setSourceData = useSetRecoilState(state.search.sourceData);

  useEffect(() => {
    return setSelectedFacetsGroups([]);
  }, []);

  const getUpdatedSelectedFacetsGroups = (facet?: string, isOpen = true) => {
    if (!facet) return selectedFacetsGroups;

    if (isOpen && selectedFacetsGroups?.includes(facet)) return selectedFacetsGroups;

    if (!isOpen) return selectedFacetsGroups.filter(group => group !== facet);

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

  const getSearchFacetsData = async (url?: string, facet?: string, isOpen?: boolean) => {
    if (!url || !facet) return;

    const updatedSelectedFacetsGroups = onTogleFilterGroupState(facet, isOpen);

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

  const onTogleFilterGroupState = (facet: string, isOpen?: boolean) => {
    const updatedSelectedFacetsGroups = getUpdatedSelectedFacetsGroups(facet, isOpen);

    setSelectedFacetsGroups(updatedSelectedFacetsGroups);

    return updatedSelectedFacetsGroups;
  };

  return { getSearchSourceData, getSearchFacetsData, onTogleFilterGroupState };
};
