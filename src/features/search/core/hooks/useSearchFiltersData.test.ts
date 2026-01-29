import { act, renderHook } from '@testing-library/react';

import * as SearchApi from '@/common/api/search.api';
import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';

import { useSearchStore, useStatusStore } from '@/store';

import { useSearchFiltersData } from './useSearchFiltersData';

jest.mock('@/common/api/search.api');
jest.mock('@/common/services/userNotification');

describe('useSearchFiltersData', () => {
  const selectedFacetsGroupsState: never[] = [];
  const setSelectedFacetsGroups = jest.fn();
  const resetSelectedFacetsGroups = jest.fn();
  const setFacetsData = jest.fn();
  const setSourceData = jest.fn();
  const addStatusMessagesItem = jest.fn();

  const DEFAULT_SEARCH_SOURCE_LIMIT = '50';
  const DEFAULT_SEARCH_FACETS_QUERY = 'id=*';

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          selectedFacetsGroups: selectedFacetsGroupsState,
          setSelectedFacetsGroups,
          resetSelectedFacetsGroups,
          setFacetsData,
          setSourceData,
        },
      },
      { store: useStatusStore, state: { addStatusMessagesItem } },
    ]);
  });

  test('resets selectedFacetsGroups on unmount', () => {
    const { unmount } = renderHook(useSearchFiltersData);

    unmount();

    expect(resetSelectedFacetsGroups).toHaveBeenCalled();
  });

  test('getSearchSourceData - fetches data and sets source data', async () => {
    const searchData = { data: 'sourceData' };
    (SearchApi.getSearchData as jest.Mock).mockResolvedValue(searchData);

    const { result } = renderHook(useSearchFiltersData);

    await act(async () => {
      await result.current.getSearchSourceData('testUrl', 'data');
    });

    expect(SearchApi.getSearchData).toHaveBeenCalledWith('testUrl', { limit: DEFAULT_SEARCH_SOURCE_LIMIT });
    expect(setSourceData).toHaveBeenCalledWith('sourceData');
  });

  test('getSearchFacetsData - fetches data and sets facets data', async () => {
    const searchData = { facets: 'facetsData' };
    (SearchApi.getSearchData as jest.Mock).mockResolvedValue(searchData);

    const { result } = renderHook(useSearchFiltersData);

    await act(async () => {
      await result.current.getSearchFacetsData('testUrl', 'facet_1', true);
    });

    expect(SearchApi.getSearchData).toHaveBeenCalledWith('testUrl', {
      facet: 'facet_1',
      query: DEFAULT_SEARCH_FACETS_QUERY,
    });
    expect(setFacetsData).toHaveBeenCalledWith('facetsData');
  });

  test('onToggleFilterGroupState - updates selectedFacetsGroups', () => {
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { selectedFacetsGroups: ['facet_1'] },
      },
    ]);

    const { result } = renderHook(() => useSearchFiltersData());

    act(() => {
      const updatedGroups = result.current.onToggleFilterGroupState('facet_2', true);
      expect(updatedGroups).toEqual(['facet_1', 'facet_2']);
      expect(setSelectedFacetsGroups).toHaveBeenCalledWith(['facet_1', 'facet_2']);
    });
  });
});
