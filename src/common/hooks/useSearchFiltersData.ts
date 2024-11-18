import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { StatusType } from '@common/constants/status.constants';
import { UserNotificationFactory } from '@common/services/userNotification';
import * as SearchApi from '@common/api/search.api';
import state from '@state';

const DEFAULT_SEARCH_SOURCE_LIMIT = '50';
const DEFAULT_SEARCH_FACETS_QUERY = 'id=*';

export const useSearchFiltersData = () => {
  const [selectedFacetsGroups, setSelectedFacetsGroups] = useRecoilState(state.search.selectedFacetsGroups);
  const resetSelectedFacetsGroups = useResetRecoilState(state.search.selectedFacetsGroups);
  const setFacetsData = useSetRecoilState(state.search.facetsData);
  const setSourceData = useSetRecoilState(state.search.sourceData);
  const setCommonStatus = useSetRecoilState(state.status.commonMessages);

  useEffect(() => {
    return resetSelectedFacetsGroups();
  }, []);

  const getUpdatedSelectedFacetsGroups = (facet?: string, isOpen = true) => {
    if (!facet) return selectedFacetsGroups;

    if (isOpen && selectedFacetsGroups?.includes(facet)) return selectedFacetsGroups;

    if (!isOpen) return selectedFacetsGroups.filter(group => group !== facet);

    return selectedFacetsGroups ? [...selectedFacetsGroups, facet] : [facet];
  };

  const getSearchSourceData = async (url?: string, sourceDataKey?: string) => {
    if (!url) return;

    try {
      const response = await SearchApi.getSearchData(url, { limit: DEFAULT_SEARCH_SOURCE_LIMIT });
      const sourceData = sourceDataKey ? response[sourceDataKey] : response;

      setSourceData(sourceData);
    } catch (error) {
      console.error(error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'),
      ]);
    }
  };

  const getSearchFacetsData = async (url?: string, facet?: string, isOpen?: boolean) => {
    if (!url || !facet) return;

    const updatedSelectedFacetsGroups = onToggleFilterGroupState(facet, isOpen);

    try {
      const facetsQueryParam = updatedSelectedFacetsGroups.join(',');
      // Generate query by selected values
      const query = DEFAULT_SEARCH_FACETS_QUERY;
      const response = await SearchApi.getSearchData(url, { facet: facetsQueryParam, query });

      setFacetsData(response.facets);
    } catch (error) {
      console.error(error);

      setCommonStatus(currentStatus => [
        ...currentStatus,
        UserNotificationFactory.createMessage(StatusType.error, 'ld.errorFetching'),
      ]);
    }
  };

  const onToggleFilterGroupState = (facet: string, isOpen?: boolean) => {
    const updatedSelectedFacetsGroups = getUpdatedSelectedFacetsGroups(facet, isOpen);

    setSelectedFacetsGroups(updatedSelectedFacetsGroups);

    return updatedSelectedFacetsGroups;
  };

  return { getSearchSourceData, getSearchFacetsData, onToggleFilterGroupState };
};
