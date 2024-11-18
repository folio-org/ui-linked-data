import { act, renderHook } from '@testing-library/react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import * as SearchApi from '@common/api/search.api';
import { useSearchFiltersData } from '@common/hooks/useSearchFiltersData';

jest.mock('recoil');
jest.mock('@common/api/search.api');
jest.mock('@common/services/userNotification');

describe('useSearchFiltersData', () => {
  const selectedFacetsGroupsState: never[] = [];
  const setSelectedFacetsGroups = jest.fn();
  const resetSelectedFacetsGroups = jest.fn();
  const setFacetsData = jest.fn();
  const setSourceData = jest.fn();
  const setCommonStatus = jest.fn();

  const DEFAULT_SEARCH_SOURCE_LIMIT = '50';
  const DEFAULT_SEARCH_FACETS_QUERY = 'id=*';

  beforeEach(() => {
    (useRecoilState as jest.Mock).mockReturnValue([selectedFacetsGroupsState, setSelectedFacetsGroups]);
    (useResetRecoilState as jest.Mock).mockReturnValue(resetSelectedFacetsGroups);
    (useSetRecoilState as jest.Mock)
      .mockReturnValueOnce(setFacetsData)
      .mockReturnValueOnce(setSourceData)
      .mockReturnValueOnce(setCommonStatus);
  });

  test('resets selectedFacetsGroups on unmount', () => {
    const { unmount } = renderHook(useSearchFiltersData);

    unmount();

    expect(resetSelectedFacetsGroups).toHaveBeenCalled();
  });

  test('getSearchSourceData - fetches data and sets source data', async () => {
    const searchData = { data: 'sourceData' };
    (SearchApi.getSearchData as jest.Mock).mockResolvedValue(searchData);
    (useSetRecoilState as jest.Mock)
      .mockReturnValueOnce(setFacetsData)
      .mockReturnValueOnce(setSourceData)
      .mockReturnValueOnce(setCommonStatus);

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
});
