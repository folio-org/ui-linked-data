import { renderHook } from '@testing-library/react';
import { useSearchFiltersData } from '@/features/search';
import { useComplexLookupApi } from './useComplexLookupApi';

jest.mock('@/features/search/hooks/filters/useSearchFiltersData');
jest.mock('@/common/constants/build.constants', () => ({ IS_EMBEDDED_MODE: false }));

describe('useComplexLookupApi', () => {
  const api = {
    endpoints: {
      facets: '/facets',
      source: '/source',
    },
    sourceKey: 'testSourceKey',
  } as ComplexLookupApiEntryConfig;
  const filters = [
    { facet: 'facet_1', isOpen: false },
    { facet: 'facet_2', isOpen: true },
  ] as SearchFilters;

  let getSearchSourceDataMock: jest.Mock;
  let getSearchFacetsDataMock: jest.Mock;

  beforeEach(() => {
    getSearchSourceDataMock = jest.fn();
    getSearchFacetsDataMock = jest.fn();

    (useSearchFiltersData as jest.Mock).mockReturnValue({
      getSearchSourceData: getSearchSourceDataMock,
      getSearchFacetsData: getSearchFacetsDataMock,
    });
  });

  it('calls getSearchFacetsData with correct arguments in getFacetsData', async () => {
    const { result } = renderHook(() => useComplexLookupApi(api, filters));
    await result.current.getFacetsData('facet_1', true);

    expect(getSearchFacetsDataMock).toHaveBeenCalledWith(api.endpoints.facets, 'facet_1', true);
  });

  it('calls getSearchSourceData and getFacetsData with correct arguments in getSourceData', async () => {
    const { result } = renderHook(() => useComplexLookupApi(api, filters));
    await result.current.getSourceData();

    expect(getSearchSourceDataMock).toHaveBeenCalledWith(api.endpoints.source, api.sourceKey);
    expect(getSearchFacetsDataMock).toHaveBeenCalledWith(api.endpoints.facets, 'facet_2', undefined);
  });
});
