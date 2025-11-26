import { renderHook, act } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import type { SearchTypeConfig } from '../../core/types';
import { useSearchControlsHandlers } from './useSearchControlsHandlers';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('useSearchControlsHandlers', () => {
  const mockConfig: SearchTypeConfig = {
    id: 'test',
    defaults: {
      segment: 'search',
      source: 'local',
      searchBy: 'keyword',
      limit: 100,
    },
    sources: {},
  };

  const setNavigationState = jest.fn();
  const resetQuery = jest.fn();
  const resetSearchBy = jest.fn();
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
          setNavigationState,
          resetQuery,
          resetSearchBy,
        },
      },
    ]);
  });

  describe('onSegmentChange', () => {
    it('updates navigation state with new segment', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'browse',
        source: 'local',
      });
    });

    it('updates URL params with new segment in URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setSearchParams).toHaveBeenCalled();
      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get('segment')).toBe('browse');
      expect(params.has('offset')).toBe(false);
    });

    it('resets pagination offset when changing segment', () => {
      const existingParams = new URLSearchParams({ offset: '20', query: 'test' });
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(existingParams);

      expect(params.has('offset')).toBe(false);
      expect(params.get('query')).toBe('test');
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onSourceChange', () => {
    it('updates navigation state with new source', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'search',
        source: 'external',
      });
    });

    it('updates URL params with new source in URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setSearchParams).toHaveBeenCalled();
      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get('source')).toBe('external');
      expect(params.has('offset')).toBe(false);
    });

    it('resets pagination offset when changing source', () => {
      const existingParams = new URLSearchParams({ offset: '30', segment: 'browse' });
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSourceChange('external');
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(existingParams);

      expect(params.has('offset')).toBe(false);
      expect(params.get('segment')).toBe('browse');
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('sets offset in URL params for URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onPageChange(2);
      });

      expect(setSearchParams).toHaveBeenCalled();
      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get('offset')).toBe('200'); // page 2 * limit 100
    });

    it('removes offset param when page is 0', () => {
      const existingParams = new URLSearchParams({ offset: '100' });
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onPageChange(0);
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(existingParams);

      expect(params.has('offset')).toBe(false);
    });

    it('calculates offset using config limit', () => {
      const customConfig = { ...mockConfig, defaults: { ...mockConfig.defaults, limit: 50 } };
      const { result } = renderHook(() => useSearchControlsHandlers({ config: customConfig, flow: 'url' }));

      act(() => {
        result.current.onPageChange(3);
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get('offset')).toBe('150'); // page 3 * limit 50
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onPageChange(1);
      });

      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('sets all search params in URL for URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      expect(setSearchParams).toHaveBeenCalled();
      const params = setSearchParams.mock.calls[0][0];

      expect(params.get('query')).toBe('test query');
      expect(params.get('searchBy')).toBe('keyword');
      expect(params.get('segment')).toBe('search');
      expect(params.get('source')).toBe('local');
    });

    it('omits empty query from URL params', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: '',
            searchBy: 'keyword',
            navigationState: { segment: 'search' },
            setNavigationState,
            resetQuery,
            resetSearchBy,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0];
      expect(params.has('query')).toBe(false);
    });

    it('omits empty searchBy from URL params', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'test',
            searchBy: '',
            navigationState: { segment: 'search' },
            setNavigationState,
            resetQuery,
            resetSearchBy,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0];
      expect(params.has('searchBy')).toBe(false);
    });

    it('omits non-string navigation state values', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'test',
            searchBy: 'keyword',
            navigationState: { segment: 123, source: null, other: undefined },
            setNavigationState,
            resetQuery,
            resetSearchBy,
          },
        },
      ]);

      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0];
      expect(params.has('segment')).toBe(false);
      expect(params.has('source')).toBe(false);
      expect(params.has('other')).toBe(false);
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'value' }));

      act(() => {
        result.current.onSubmit();
      });

      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('resets query and searchBy', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onReset();
      });

      expect(resetQuery).toHaveBeenCalled();
      expect(resetSearchBy).toHaveBeenCalled();
    });

    it('resets navigation state to defaults from config', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onReset();
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'search',
        source: 'local',
      });
    });

    it('resets navigation state to empty object when no defaults', () => {
      const configWithoutDefaults: SearchTypeConfig = {
        id: 'test',
        sources: {},
      };
      const { result } = renderHook(() => useSearchControlsHandlers({ config: configWithoutDefaults, flow: 'url' }));

      act(() => {
        result.current.onReset();
      });

      expect(setNavigationState).toHaveBeenCalledWith({});
    });

    it('clears URL params in URL flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      act(() => {
        result.current.onReset();
      });

      expect(setSearchParams).toHaveBeenCalledWith({});
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'value' }));

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
      const { result, rerender } = renderHook(() => useSearchControlsHandlers({ config: mockConfig, flow: 'url' }));

      const firstHandlers = result.current;
      rerender();
      const secondHandlers = result.current;

      expect(firstHandlers.onSegmentChange).toBe(secondHandlers.onSegmentChange);
      expect(firstHandlers.onSourceChange).toBe(secondHandlers.onSourceChange);
      expect(firstHandlers.onPageChange).toBe(secondHandlers.onPageChange);
      expect(firstHandlers.onSubmit).toBe(secondHandlers.onSubmit);
      expect(firstHandlers.onReset).toBe(secondHandlers.onReset);
    });

    it('uses refs for config and flow to avoid recreating handlers', () => {
      const { result, rerender } = renderHook(({ config, flow }) => useSearchControlsHandlers({ config, flow }), {
        initialProps: { config: mockConfig, flow: 'url' as const },
      });

      const firstHandlers = result.current;

      // Rerender with different config object (but same content)
      rerender({ config: { ...mockConfig }, flow: 'url' as const });
      const secondHandlers = result.current;

      // Handlers should remain stable
      expect(firstHandlers.onSegmentChange).toBe(secondHandlers.onSegmentChange);
    });
  });
});
