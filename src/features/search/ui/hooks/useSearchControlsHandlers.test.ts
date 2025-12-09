import { renderHook, act } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import { SearchParam, type SearchTypeConfig } from '../../core';
import { useSearchControlsHandlers } from './useSearchControlsHandlers';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('useSearchControlsHandlers', () => {
  const mockConfig: SearchTypeConfig = {
    id: 'test',
    defaults: {
      searchBy: 'keyword',
      limit: 100,
    },
  };

  const setNavigationState = jest.fn();
  const resetQuery = jest.fn();
  const resetSearchBy = jest.fn();
  const setQuery = jest.fn();
  const setSearchBy = jest.fn();
  const setDraftBySegment = jest.fn();
  const setCommittedValues = jest.fn();
  const resetCommittedValues = jest.fn();
  const setSearchParams = jest.fn();

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), setSearchParams]);

    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          query: 'test query',
          searchBy: 'keyword',
          navigationState: { segment: 'search', source: 'local' },
          draftBySegment: {},
          setNavigationState,
          resetQuery,
          resetSearchBy,
          setQuery,
          setSearchBy,
          setDraftBySegment,
          setCommittedValues,
          resetCommittedValues,
        },
      },
    ]);
  });

  describe('onSegmentChange', () => {
    it('updates navigation state with new segment', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'browse',
      });
    });

    it('updates URL params with new segment in URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setSearchParams).toHaveBeenCalled();
      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get(SearchParam.SEGMENT)).toBe('browse');
      expect(params.has(SearchParam.OFFSET)).toBe(false);
    });

    it('resets pagination offset when changing segment', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams({ offset: '20', query: 'test' }));

      expect(params.has(SearchParam.OFFSET)).toBe(false);
      expect(params.get(SearchParam.SEGMENT)).toBe('browse');
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onSourceChange', () => {
    it('updates navigation state with new source', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'search',
        source: 'external',
      });
    });

    it('does not update URL on source change (only on submit)', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setSearchParams).not.toHaveBeenCalled();
    });

    it('updates navigation state in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('sets offset in URL params for URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onPageChange(2);
      });

      expect(setSearchParams).toHaveBeenCalled();
      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get(SearchParam.OFFSET)).toBe('200'); // page 2 * limit 100
    });

    it('removes offset param when page is 0', () => {
      const existingParams = new URLSearchParams({ offset: '100' });
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onPageChange(0);
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(existingParams);

      expect(params.has(SearchParam.OFFSET)).toBe(false);
    });

    it('calculates offset using coreConfig limit', () => {
      const customConfig = { ...mockConfig, defaults: { ...mockConfig.defaults, limit: 50 } };
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: customConfig, flow: 'url' }));

      act(() => {
        result.current.onPageChange(3);
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get(SearchParam.OFFSET)).toBe('150'); // page 3 * limit 50
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onPageChange(1);
      });

      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('sets all search params in URL for URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      expect(setSearchParams).toHaveBeenCalled();
      const params = setSearchParams.mock.calls[0][0] as URLSearchParams;

      expect(params.get(SearchParam.QUERY)).toBe('test query');
      expect(params.get(SearchParam.SEARCH_BY)).toBe('keyword');
      expect(params.get(SearchParam.SEGMENT)).toBe('search');
      expect(params.get(SearchParam.SOURCE)).toBe('local');
    });

    it('omits empty query from URL params', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: '',
            searchBy: 'keyword',
            navigationState: { segment: 'search' },
            draftBySegment: {},
            setNavigationState,
            resetQuery,
            resetSearchBy,
            setQuery,
            setSearchBy,
            setDraftBySegment,
            setCommittedValues,
            resetCommittedValues,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(params.has(SearchParam.QUERY)).toBe(false);
    });

    it('omits empty searchBy from URL params', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'test',
            searchBy: '',
            navigationState: { segment: 'search' },
            draftBySegment: {},
            setNavigationState,
            resetQuery,
            resetSearchBy,
            setQuery,
            setSearchBy,
            setDraftBySegment,
            setCommittedValues,
            resetCommittedValues,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(params.has(SearchParam.SEARCH_BY)).toBe(false);
    });

    it('omits non-string navigation state values', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'test',
            searchBy: 'keyword',
            navigationState: { segment: 123, source: null, other: undefined },
            draftBySegment: {},
            setNavigationState,
            resetQuery,
            resetSearchBy,
            setQuery,
            setSearchBy,
            setDraftBySegment,
            setCommittedValues,
            resetCommittedValues,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(params.has(SearchParam.SOURCE)).toBe(false);
      expect(params.has('other')).toBe(false);
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onSubmit();
      });

      expect(setSearchParams).not.toHaveBeenCalled();
      expect(setCommittedValues).toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('resets query and searchBy', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onReset();
      });

      expect(resetQuery).toHaveBeenCalled();
      expect(resetSearchBy).toHaveBeenCalled();
    });

    it('resets navigation state to defaults from coreConfig', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onReset();
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'test',
      });
    });

    it('resets navigation state with segment from config id', () => {
      const configWithoutDefaults: SearchTypeConfig = {
        id: 'test',
      };
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: configWithoutDefaults, flow: 'url' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(setNavigationState).toHaveBeenCalledWith({ segment: 'test' });
    });

    it('clears URL params in URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onReset();
      });

      expect(setSearchParams).toHaveBeenCalled();

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams({ query: 'old', offset: '10' }));

      // onReset preserves the current segment from navigationState (which is 'search' from beforeEach)
      expect(params.get(SearchParam.SEGMENT)).toBe('search');
      expect(params.has(SearchParam.QUERY)).toBe(false);
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onReset();
      });

      expect(resetQuery).toHaveBeenCalled();
      expect(resetSearchBy).toHaveBeenCalled();
      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('Handler stability', () => {
    it('returns stable handler references', () => {
      const { result, rerender } = renderHook(() => useSearchControlsHandlers({ coreConfig: mockConfig, flow: 'url' }));

      const firstHandlers = result.current;
      rerender();
      const secondHandlers = result.current;

      expect(firstHandlers.onSegmentChange).toBe(secondHandlers.onSegmentChange);
      expect(firstHandlers.onSourceChange).toBe(secondHandlers.onSourceChange);
      expect(firstHandlers.onPageChange).toBe(secondHandlers.onPageChange);
      expect(firstHandlers.onSubmit).toBe(secondHandlers.onSubmit);
      expect(firstHandlers.onReset).toBe(secondHandlers.onReset);
    });

    it('uses refs for coreConfig and flow to avoid recreating handlers', () => {
      const { result, rerender } = renderHook(
        ({ coreConfig, flow }) => useSearchControlsHandlers({ coreConfig: coreConfig, flow }),
        {
          initialProps: { coreConfig: mockConfig, flow: 'url' as const },
        },
      );

      const firstHandlers = result.current;

      // Rerender with different coreConfig object (but same content)
      rerender({ coreConfig: { ...mockConfig }, flow: 'url' as const });
      const secondHandlers = result.current;

      // Handlers should remain stable
      expect(firstHandlers.onSegmentChange).toBe(secondHandlers.onSegmentChange);
    });
  });
});
