import { renderHook, waitFor } from '@testing-library/react';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { useLoadingStateStore, useSearchStore } from '@src/store';
import { setInitialGlobalState } from '@src/test/__mocks__/store';

jest.mock('@common/hooks/useSearchContext');

describe('useLoadSearchResults', () => {
  const setData = jest.fn();
  const fetchData = jest.fn();
  const setSearchBy = jest.fn();
  const setQuery = jest.fn();
  const setIsLoading = jest.fn();
  const originalLocation = globalThis.location.href;

  const mockSearchContext = {
    hasSearchParams: true,
    getSearchSourceData: jest.fn().mockResolvedValue(undefined),
    getSearchFacetsData: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useLoadingStateStore,
        state: { isLoading: false, setIsLoading },
      },
      {
        store: useSearchStore,
        state: {
          data: null,
          searchBy: '',
          query: '',
          setQuery,
          setData,
          setSearchBy,
          forceRefresh: false,
        },
      },
    ]);

    (useSearchContext as jest.Mock).mockReturnValue(mockSearchContext);
  });

  afterEach(() => {
    globalThis.history.replaceState({}, '', originalLocation);
  });

  it('updates state with query and searchBy', async () => {
    globalThis.history.replaceState({}, '', 'http://localhost/?query=test%20query&searchBy=title');

    renderHook(() => useLoadSearchResults(fetchData));

    await waitFor(() => {
      expect(fetchData).toHaveBeenCalled();
    });

    expect(setQuery).toHaveBeenCalledWith('test query');
    expect(setSearchBy).toHaveBeenCalledWith('title');
  });

  it('clears data when no query param', () => {
    globalThis.history.replaceState({}, '', 'http://localhost/');

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setData).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
  });
});
