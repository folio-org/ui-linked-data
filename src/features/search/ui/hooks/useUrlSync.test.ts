import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import type { SearchTypeConfig } from '../../core/types';
import { useUrlSync } from './useUrlSync';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('useUrlSync', () => {
  const mockConfig: SearchTypeConfig = {
    id: 'test',
    defaults: {
      searchBy: 'keyword',
      limit: 100,
    },
  };

  const setQuery = jest.fn();
  const setSearchBy = jest.fn();
  const setNavigationState = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: '',
          searchBy: 'keyword',
          navigationState: {},
          setQuery,
          setSearchBy,
          setNavigationState,
        },
      },
    ]);
  });

  describe('URL flow', () => {
    it('syncs query from URL to store when searchBy is also present', () => {
      const searchParams = new URLSearchParams({ query: 'test query', searchBy: 'keyword' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setQuery).toHaveBeenCalledWith('test query');
    });

    it('does not sync query when it is advanced search (no searchBy in URL)', () => {
      const searchParams = new URLSearchParams({ query: 'test query' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setQuery).not.toHaveBeenCalled();
    });

    it('syncs searchBy from URL to store', () => {
      const searchParams = new URLSearchParams({ searchBy: 'title' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setSearchBy).toHaveBeenCalledWith('title');
    });

    it('syncs segment from URL to store', () => {
      const searchParams = new URLSearchParams({ segment: 'browse' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setNavigationState).toHaveBeenCalledWith({ segment: 'browse' });
    });

    it('syncs source from URL to store', () => {
      const searchParams = new URLSearchParams({ source: 'external' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setNavigationState).toHaveBeenCalledWith({ source: 'external' });
    });

    it('syncs multiple params from URL', () => {
      const searchParams = new URLSearchParams({
        query: 'test query',
        searchBy: 'author',
        segment: 'browse',
        source: 'external',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setQuery).toHaveBeenCalledWith('test query');
      expect(setSearchBy).toHaveBeenCalledWith('author');
      // The hook updates segment and source in separate sequential calls
      // Because they're updating in the same effect, they both see empty navigationState
      expect(setNavigationState).toHaveBeenCalledTimes(2);
      expect(setNavigationState.mock.calls[0][0]).toEqual({ segment: 'browse' });
      expect(setNavigationState.mock.calls[1][0]).toEqual({ source: 'external' });
    });

    it('clears query when URL has no query but store does and searchBy is present', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'existing query',
            searchBy: 'keyword',
            navigationState: {},
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      const searchParams = new URLSearchParams({ searchBy: 'keyword' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setQuery).toHaveBeenCalledWith('');
    });

    it('does not clear query when URL has no query and no searchBy (transitioning from advanced search)', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'existing query',
            searchBy: 'keyword',
            navigationState: {},
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setQuery).not.toHaveBeenCalled();
    });

    it('does not update store when URL value matches store value', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'test query',
            searchBy: 'keyword',
            navigationState: {},
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      const searchParams = new URLSearchParams({ query: 'test query', searchBy: 'keyword' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setQuery).not.toHaveBeenCalled();
    });

    it('preserves existing navigation state when updating segment', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: '',
            searchBy: 'keyword',
            navigationState: { source: 'local', existingKey: 'value' },
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      const searchParams = new URLSearchParams({ segment: 'browse' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setNavigationState).toHaveBeenCalledWith({
        source: 'local',
        existingKey: 'value',
        segment: 'browse',
      });
    });

    it('preserves existing navigation state when updating source', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: '',
            searchBy: 'keyword',
            navigationState: { segment: 'search', existingKey: 'value' },
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      const searchParams = new URLSearchParams({ source: 'external' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'search',
        existingKey: 'value',
        source: 'external',
      });
    });

    it('does not update segment if URL value matches current segment', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: '',
            searchBy: 'keyword',
            navigationState: { segment: 'browse' },
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      const searchParams = new URLSearchParams({ segment: 'browse' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setNavigationState).not.toHaveBeenCalled();
    });

    it('does not update source if URL value matches current source', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: '',
            searchBy: 'keyword',
            navigationState: { source: 'external' },
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      const searchParams = new URLSearchParams({ source: 'external' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setNavigationState).not.toHaveBeenCalled();
    });
  });

  describe('Value flow', () => {
    it('does not sync when flow is value', () => {
      const searchParams = new URLSearchParams({
        query: 'test query',
        searchBy: 'title',
        segment: 'browse',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() => useUrlSync({ flow: 'value', config: mockConfig }));

      expect(setQuery).not.toHaveBeenCalled();
      expect(setSearchBy).not.toHaveBeenCalled();
      expect(setNavigationState).not.toHaveBeenCalled();
    });
  });

  describe('Effect dependencies', () => {
    it('re-runs when searchParams change', () => {
      const searchParams_1 = new URLSearchParams({ query: 'first', searchBy: 'keyword' });
      const searchParams_2 = new URLSearchParams({ query: 'second', searchBy: 'keyword' });

      (useSearchParams as jest.Mock).mockReturnValue([searchParams_1]);
      const { rerender } = renderHook(() => useUrlSync({ flow: 'url', config: mockConfig }));

      expect(setQuery).toHaveBeenCalledWith('first');
      setQuery.mockClear();

      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'first',
            searchBy: 'keyword',
            navigationState: {},
            setQuery,
            setSearchBy,
            setNavigationState,
          },
        },
      ]);

      (useSearchParams as jest.Mock).mockReturnValue([searchParams_2]);
      rerender();

      expect(setQuery).toHaveBeenCalledWith('second');
    });
  });
});
