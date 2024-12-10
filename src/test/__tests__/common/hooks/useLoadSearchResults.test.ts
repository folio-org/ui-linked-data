import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { SearchQueryParams } from '@common/constants/routes.constants';
import { useLoadSearchResults } from '@common/hooks/useLoadSearchResults';
import { useLoadingStateStore, useSearchStore } from '@src/store';
import { setInitialGlobalState, setUpdatedGlobalState } from '@src/test/__mocks__/store';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

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
    const searchParams = new URLSearchParams({
      [SearchQueryParams.Query]: 'test query',
      [SearchQueryParams.SearchBy]: 'title',
    });

    fetchData.mockResolvedValue([{ test: ['test value'] }]);
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    setUpdatedGlobalState([
      {
        store: useSearchStore,
        updatedState: { forceRefresh: false, searchBy: 'title' },
      },
    ]);

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setSearchBy).toHaveBeenCalledWith('title');
    expect(setQuery).toHaveBeenCalledWith('test query');
    expect(fetchData).toHaveBeenCalledWith({ query: 'test query', searchBy: 'title', offset: 0 });
  });

  it('clears data when no query param', () => {
    const searchParams = new URLSearchParams({});

    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

    renderHook(() => useLoadSearchResults(fetchData));

    expect(setData).not.toHaveBeenCalled();
    expect(fetchData).not.toHaveBeenCalled();
  });
});
