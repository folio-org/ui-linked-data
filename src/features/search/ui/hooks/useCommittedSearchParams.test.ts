import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { setInitialGlobalState } from '@/test/__mocks__/store';
import { useSearchStore } from '@/store';
import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import { useCommittedSearchParams } from './useCommittedSearchParams';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('useCommittedSearchParams', () => {
  const defaultCommittedValues = {
    query: '',
    searchBy: DEFAULT_SEARCH_BY,
    segment: undefined,
    source: undefined,
    offset: 0,
  };

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: {
          committedValues: defaultCommittedValues,
        },
      },
    ]);
  });

  describe('URL flow', () => {
    it('returns committed params from URL search params', () => {
      const searchParams = new URLSearchParams({
        query: 'test query',
        searchBy: 'title',
        segment: 'browse',
        source: 'external',
        offset: '20',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useCommittedSearchParams({ flow: 'url', defaultSegment: 'search', hasSegments: true }),
      );

      expect(result.current).toEqual({
        segment: 'browse',
        query: 'test query',
        searchBy: 'title',
        source: 'external',
        offset: 20,
      });
    });

    it('uses default values when URL params are empty', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useCommittedSearchParams({ flow: 'url', defaultSegment: 'search', hasSegments: true }),
      );

      expect(result.current).toEqual({
        segment: 'search',
        query: '',
        searchBy: DEFAULT_SEARCH_BY,
        source: undefined,
        offset: 0,
      });
    });

    it('returns undefined segment when hasSegments is false', () => {
      const searchParams = new URLSearchParams({ segment: 'browse', query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useCommittedSearchParams({ flow: 'url', defaultSegment: 'search', hasSegments: false }),
      );

      expect(result.current.segment).toBeUndefined();
      expect(result.current.query).toBe('test');
    });

    it('parses offset as integer', () => {
      const searchParams = new URLSearchParams({ offset: '50' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() => useCommittedSearchParams({ flow: 'url' }));

      expect(result.current.offset).toBe(50);
    });

    it('handles invalid offset by defaulting to 0', () => {
      const searchParams = new URLSearchParams({ offset: 'invalid' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() => useCommittedSearchParams({ flow: 'url' }));

      expect(result.current.offset).toBe(NaN);
    });
  });

  describe('Value flow', () => {
    it('returns committed params from store committedValues', () => {
      const storeCommittedValues = {
        query: 'store query',
        searchBy: 'author',
        segment: 'resources',
        source: 'internal',
        offset: 30,
      };
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            committedValues: storeCommittedValues,
          },
        },
      ]);

      const searchParams = new URLSearchParams({ query: 'url query' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useCommittedSearchParams({ flow: 'value', defaultSegment: 'search', hasSegments: true }),
      );

      expect(result.current).toEqual({
        segment: 'resources',
        query: 'store query',
        searchBy: 'author',
        source: 'internal',
        offset: 30,
      });
    });

    it('uses default segment when store segment is empty', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            committedValues: {
              ...defaultCommittedValues,
              segment: '',
            },
          },
        },
      ]);

      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useCommittedSearchParams({ flow: 'value', defaultSegment: 'defaultSeg', hasSegments: true }),
      );

      expect(result.current.segment).toBe('defaultSeg');
    });

    it('returns undefined segment when hasSegments is false', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            committedValues: {
              ...defaultCommittedValues,
              segment: 'someSegment',
              query: 'test',
            },
          },
        },
      ]);

      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useCommittedSearchParams({ flow: 'value', defaultSegment: 'search', hasSegments: false }),
      );

      expect(result.current.segment).toBeUndefined();
      expect(result.current.query).toBe('test');
    });

    it('ignores URL params in value flow', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            committedValues: defaultCommittedValues,
          },
        },
      ]);

      const searchParams = new URLSearchParams({
        query: 'url query',
        searchBy: 'title',
        segment: 'browse',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useCommittedSearchParams({ flow: 'value', defaultSegment: 'search', hasSegments: true }),
      );

      expect(result.current.query).toBe('');
      expect(result.current.searchBy).toBe(DEFAULT_SEARCH_BY);
      expect(result.current.segment).toBe('search');
    });
  });

  describe('Memoization', () => {
    it('returns same reference when URL params do not change', () => {
      const searchParams = new URLSearchParams({ query: 'test' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result, rerender } = renderHook(() => useCommittedSearchParams({ flow: 'url' }));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('returns new reference when URL params change', () => {
      const searchParams1 = new URLSearchParams({ query: 'first' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams1]);

      const { result, rerender } = renderHook(() => useCommittedSearchParams({ flow: 'url' }));

      const firstResult = result.current;

      const searchParams2 = new URLSearchParams({ query: 'second' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams2]);
      rerender();

      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(secondResult.query).toBe('second');
    });

    it('returns new reference when store committedValues change in value flow', () => {
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            committedValues: { ...defaultCommittedValues, query: 'first' },
          },
        },
      ]);

      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result, rerender } = renderHook(() => useCommittedSearchParams({ flow: 'value' }));

      const firstResult = result.current;

      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            committedValues: { ...defaultCommittedValues, query: 'second' },
          },
        },
      ]);
      rerender();

      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
      expect(secondResult.query).toBe('second');
    });
  });

  describe('Default parameters', () => {
    it('defaults hasSegments to true', () => {
      const searchParams = new URLSearchParams({ segment: 'browse' });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() => useCommittedSearchParams({ flow: 'url', defaultSegment: 'search' }));

      expect(result.current.segment).toBe('browse');
    });

    it('works without defaultSegment', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() => useCommittedSearchParams({ flow: 'url', hasSegments: true }));

      expect(result.current.segment).toBeUndefined();
    });
  });
});
