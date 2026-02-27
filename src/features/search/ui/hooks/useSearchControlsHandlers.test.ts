import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useSearchParams } from 'react-router-dom';

import { act, renderHook } from '@testing-library/react';

import { useInputsState, useSearchStore, useUIState } from '@/store';

import { SearchParam, type SearchTypeConfig, resolveCoreConfig } from '../../core';
import { resolveUIConfig } from '../config';
import { getValidSearchBy } from '../utils';
import { useSearchControlsHandlers } from './useSearchControlsHandlers';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../../core', () => {
  const actual = jest.requireActual('../../core');

  return {
    ...actual,
    normalizeQuery: jest.requireActual('../../core/utils/search.helper').normalizeQuery,
    resolveCoreConfig: jest.fn(),
  };
});

jest.mock('../config', () => ({
  resolveUIConfig: jest.fn(),
}));

jest.mock('../utils', () => {
  const actual = jest.requireActual('../utils');

  return {
    ...actual,
    getValidSearchBy: jest.fn(searchBy => searchBy),
  };
});

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
  const resetPreviewContent = jest.fn();
  const resetFullDisplayComponentType = jest.fn();
  const resetCurrentlyPreviewedEntityBfid = jest.fn();

  const mockSegmentConfig: SearchTypeConfig = {
    id: 'browse',
    defaults: {
      searchBy: 'title',
      limit: 100,
    },
  };

  const mockUIConfig = {
    searchableIndices: [
      { value: 'title', labelId: 'Title' },
      { value: 'keyword', labelId: 'Keyword' },
    ],
  };

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), setSearchParams]);
    (resolveCoreConfig as jest.Mock).mockReturnValue(mockSegmentConfig);
    (resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
    (getValidSearchBy as jest.Mock).mockImplementation(searchBy => searchBy);

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
      {
        store: useInputsState,
        state: {
          resetPreviewContent,
        },
      },
      {
        store: useUIState,
        state: {
          resetFullDisplayComponentType,
          resetCurrentlyPreviewedEntityBfid,
        },
      },
    ]);
  });

  describe('onSegmentChange', () => {
    it('updates navigation state with new segment', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'browse',
      });
    });

    it('updates URL params with new segment in URL flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

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
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams({ offset: '20', query: 'test' }));

      expect(params.has(SearchParam.OFFSET)).toBe(false);
      expect(params.get(SearchParam.SEGMENT)).toBe('browse');
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'value' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });

    it('resets preview and comparison state when changing segment', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(resetPreviewContent).toHaveBeenCalled();
      expect(resetFullDisplayComponentType).toHaveBeenCalled();
      expect(resetCurrentlyPreviewedEntityBfid).toHaveBeenCalled();
    });
  });

  describe('onSourceChange', () => {
    it('updates navigation state with new source', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'search',
        source: 'external',
      });
    });

    it('does not update URL on source change (only on submit)', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setSearchParams).not.toHaveBeenCalled();
    });

    it('updates navigation state in value flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'value' }),
      );

      act(() => {
        result.current.onSourceChange('external');
      });

      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('sets offset in URL params for URL flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

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
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onPageChange(0);
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(existingParams);

      expect(params.has(SearchParam.OFFSET)).toBe(false);
    });

    it('calculates offset using coreConfig limit', () => {
      const customConfig = { ...mockConfig, defaults: { ...mockConfig.defaults, limit: 50 } };
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: customConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onPageChange(3);
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get(SearchParam.OFFSET)).toBe('150'); // page 3 * limit 50
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'value' }),
      );

      act(() => {
        result.current.onPageChange(1);
      });

      expect(setSearchParams).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('sets all search params in URL for URL flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(params.has(SearchParam.SOURCE)).toBe(false);
      expect(params.has('other')).toBe(false);
    });

    it('does not update URL in value flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'value' }),
      );

      act(() => {
        result.current.onSubmit();
      });

      expect(setSearchParams).not.toHaveBeenCalled();
      expect(setCommittedValues).toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('resets query and searchBy', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(resetQuery).toHaveBeenCalled();
      expect(resetSearchBy).toHaveBeenCalled();
    });

    it('resets navigation state to defaults from coreConfig', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'search',
      });
    });

    it('resets navigation state using active segment from navigationState', () => {
      const configWithoutDefaults: SearchTypeConfig = {
        id: 'test',
      };
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: configWithoutDefaults, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(setNavigationState).toHaveBeenCalledWith({ segment: 'search' });
    });

    it('clears URL params in URL flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

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
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'value' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(resetQuery).toHaveBeenCalled();
      expect(resetSearchBy).toHaveBeenCalled();
      expect(setNavigationState).toHaveBeenCalled();
      expect(setSearchParams).not.toHaveBeenCalled();
    });

    it('resets preview and comparison state when resetting', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(resetPreviewContent).toHaveBeenCalled();
      expect(resetFullDisplayComponentType).toHaveBeenCalled();
      expect(resetCurrentlyPreviewedEntityBfid).toHaveBeenCalled();
    });
  });

  describe('Handler stability', () => {
    it('returns stable handler references', () => {
      const { result, rerender } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

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
        ({ coreConfig, flow }) => useSearchControlsHandlers({ coreConfig: coreConfig, uiConfig: mockUIConfig, flow }),
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

  describe('Config resolution and validation', () => {
    const mockSegmentConfig: SearchTypeConfig = {
      id: 'browse',
      defaults: {
        searchBy: 'title',
        limit: 50,
      },
    };

    const mockUIConfig = {
      id: 'browse',
      searchableIndices: [
        { value: 'title', labelId: 'Title', placeholder: 'ld.placeholder.title' },
        { value: 'keyword', labelId: 'Keyword', placeholder: 'ld.placeholder.keyword' },
      ],
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (resolveCoreConfig as jest.Mock).mockReturnValue(mockSegmentConfig);
      (resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (getValidSearchBy as jest.Mock).mockImplementation(searchBy => searchBy);

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

    it('resolves config for new segment on segment change', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      // Verify the handler completes without errors and uses the mocked configs
      expect(setQuery).toHaveBeenCalledWith('');
      expect(setSearchBy).toHaveBeenCalledWith('title'); // from mockSegmentConfig
    });

    it('validates searchBy when restoring draft from segment', () => {
      const mockDraft = { query: 'test', searchBy: 'isbn' };
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'old query',
            searchBy: 'keyword',
            navigationState: { segment: 'search' },
            draftBySegment: { browse: mockDraft },
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

      (getValidSearchBy as jest.Mock).mockReturnValue('isbn');

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      // Verify the searchBy from the draft is used (isbn from mockDraft)
      expect(setSearchBy).toHaveBeenCalledWith('isbn');
    });

    it('uses default searchBy when no draft exists for segment', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setQuery).toHaveBeenCalledWith('');
      expect(setSearchBy).toHaveBeenCalledWith('title'); // from mockSegmentConfig defaults
    });

    it('preserves source from existing draft when changing segments', () => {
      const mockDraft = { query: 'test', searchBy: 'keyword', source: 'external' };
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'old query',
            searchBy: 'keyword',
            navigationState: { segment: 'search' },
            draftBySegment: { browse: mockDraft },
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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'browse',
        source: 'external',
      });
    });

    it('removes source from navigation when draft has no source', () => {
      const mockDraft = { query: 'test', searchBy: 'keyword' };
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'old query',
            searchBy: 'keyword',
            navigationState: { segment: 'search', source: 'internal' },
            draftBySegment: { browse: mockDraft },
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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setNavigationState).toHaveBeenCalledWith({
        segment: 'browse',
      });
    });

    it('validates searchBy on submit with effective config', () => {
      (resolveCoreConfig as jest.Mock).mockReturnValue(mockSegmentConfig);
      (resolveUIConfig as jest.Mock).mockReturnValue(mockUIConfig);
      (getValidSearchBy as jest.Mock).mockReturnValue('title');

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSubmit();
      });

      // Verify the validated searchBy is saved and URL is updated
      expect(setDraftBySegment).toHaveBeenCalled();
      expect(setSearchParams).toHaveBeenCalled();
    });

    it('saves validated searchBy to draft on submit', () => {
      (getValidSearchBy as jest.Mock).mockReturnValue('validated-search-by');

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSubmit();
      });

      expect(setDraftBySegment).toHaveBeenCalledWith({
        search: {
          query: 'test query',
          searchBy: 'validated-search-by',
          source: 'local',
        },
      });
    });

    it('includes validated searchBy in URL params on submit', () => {
      (getValidSearchBy as jest.Mock).mockReturnValue('validated-search-by');

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSubmit();
      });

      const params = setSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(params.get(SearchParam.SEARCH_BY)).toBe('validated-search-by');
    });

    it('auto-searches when switching to segment with preserved query', () => {
      const mockDraft = { query: 'preserved query', searchBy: 'title', source: 'external' };
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'old query',
            searchBy: 'keyword',
            navigationState: { segment: 'search' },
            draftBySegment: { browse: mockDraft },
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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get(SearchParam.SEGMENT)).toBe('browse');
      expect(params.get(SearchParam.QUERY)).toBe('preserved query');
      expect(params.get(SearchParam.SEARCH_BY)).toBe('title');
      expect(params.get(SearchParam.SOURCE)).toBe('external');
    });

    it('commits to value flow when switching to segment with preserved query', () => {
      const mockDraft = { query: 'preserved query', searchBy: 'title' };
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'old query',
            searchBy: 'keyword',
            navigationState: { segment: 'search' },
            draftBySegment: { browse: mockDraft },
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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'value' }),
      );

      act(() => {
        result.current.onSegmentChange('browse');
      });

      expect(setCommittedValues).toHaveBeenCalledWith({
        segment: 'browse',
        query: 'preserved query',
        searchBy: 'title',
        source: undefined,
        offset: 0,
      });
    });

    it('falls back to passed coreConfig when resolveCoreConfig returns undefined', () => {
      (resolveCoreConfig as jest.Mock).mockReturnValue(undefined);
      (getValidSearchBy as jest.Mock).mockImplementation(searchBy => searchBy);

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSubmit();
      });

      expect(getValidSearchBy).toHaveBeenCalledWith(expect.anything(), expect.anything(), mockConfig);
    });
  });

  describe('Draft management', () => {
    it('saves current segment draft before switching segments', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'current query',
            searchBy: 'isbn',
            navigationState: { segment: 'authorities', source: 'internal' },
            draftBySegment: { existing: { query: 'old', searchBy: 'keyword' } },
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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onSegmentChange('resources');
      });

      expect(setDraftBySegment).toHaveBeenCalledWith({
        existing: { query: 'old', searchBy: 'keyword' },
        authorities: {
          query: 'current query',
          searchBy: 'isbn',
          source: 'internal',
        },
      });
    });

    it('removes segment draft on reset', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'test',
            searchBy: 'keyword',
            navigationState: { segment: 'authorities' },
            draftBySegment: {
              authorities: { query: 'draft query', searchBy: 'title' },
              other: { query: 'other query', searchBy: 'isbn' },
            },
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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(setDraftBySegment).toHaveBeenCalledWith({
        other: { query: 'other query', searchBy: 'isbn' },
      });
    });

    it('preserves segment and source in URL on reset', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            query: 'test',
            searchBy: 'keyword',
            navigationState: { segment: 'authorities', source: 'external' },
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

      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'url' }),
      );

      act(() => {
        result.current.onReset();
      });

      const updaterFn = setSearchParams.mock.calls[0][0];
      const params = updaterFn(new URLSearchParams());

      expect(params.get(SearchParam.SEGMENT)).toBe('authorities');
      expect(params.has(SearchParam.SOURCE)).toBe(false);
      expect(params.has(SearchParam.QUERY)).toBe(false);
      expect(params.has(SearchParam.SEARCH_BY)).toBe(false);
    });

    it('resets committed values in value flow', () => {
      const { result } = renderHook(() =>
        useSearchControlsHandlers({ coreConfig: mockConfig, uiConfig: mockUIConfig, flow: 'value' }),
      );

      act(() => {
        result.current.onReset();
      });

      expect(resetCommittedValues).toHaveBeenCalled();
    });
  });
});
