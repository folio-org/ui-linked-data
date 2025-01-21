import { act, renderHook } from '@testing-library/react';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';
import { useLoadingStateStore, useSearchStore } from '@src/store';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';

describe('useLoadSearchResults', () => {
  const setData = jest.fn();
  const fetchData = jest.fn();
  const setSearchBy = jest.fn();
  const setQuery = jest.fn();
  const setIsLoading = jest.fn();

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
  });

  it('fetches data and updates state with query and searchBy', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?query=test%20query&searchBy=title',
      },
      writable: true,
    });

    fetchData.mockResolvedValue([{ test: ['test value'] }]);
    act(() =>
      setUpdatedGlobalState([
        {
          store: useSearchStore,
          updatedState: { forceRefresh: false, searchBy: 'title' },
        },
      ]),
    );

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setSearchBy).toHaveBeenCalledWith('title');
    expect(setQuery).toHaveBeenCalledWith('test query');
    expect(fetchData).toHaveBeenCalledWith({ query: 'test query', searchBy: 'title', offset: 0 });
  });

  it('clears data when no query param', () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
      },
      writable: true,
    });

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setData).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
  });
});
