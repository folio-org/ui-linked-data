import { setInitialGlobalState } from '@/test/__mocks__/store';

import { useSearchParams } from 'react-router-dom';

import { renderHook } from '@testing-library/react';

import { useSearchStore } from '@/store';

import { SearchParam } from '../../core';
import { useSearchSegment } from './useSearchSegment';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('useSearchSegment', () => {
  const setNavigationState = jest.fn();

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useSearchStore,
        state: { navigationState: {}, setNavigationState },
      },
    ]);
  });

  describe('url flow', () => {
    it('reads segment from URL params', () => {
      const searchParams = new URLSearchParams({
        [SearchParam.SEGMENT]: 'resources',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useSearchSegment({
          flow: 'url',
          segments: ['resources', 'authorities'],
          defaultSegment: 'resources',
        }),
      );

      expect(result.current.currentSegment).toBe('resources');
      expect(setNavigationState).not.toHaveBeenCalled();
    });

    it('reads source from URL params', () => {
      const searchParams = new URLSearchParams({
        [SearchParam.SEGMENT]: 'hubs',
        [SearchParam.SOURCE]: 'external',
      });
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useSearchSegment({
          flow: 'url',
          segments: ['hubs'],
        }),
      );

      expect(result.current.currentSegment).toBe('hubs');
      expect(result.current.currentSource).toBe('external');
    });

    it('returns default segment when URL param is missing', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useSearchSegment({
          flow: 'url',
          segments: ['resources', 'authorities'],
          defaultSegment: 'authorities',
        }),
      );

      expect(result.current.currentSegment).toBe('authorities');
    });

    it('returns first segment when no default provided and URL is empty', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useSearchSegment({
          flow: 'url',
          segments: ['authorities', 'resources'],
        }),
      );

      expect(result.current.currentSegment).toBe('authorities');
    });
  });

  describe('value flow - initialization', () => {
    it('initializes state with default segment', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() =>
        useSearchSegment({
          flow: 'value',
          segments: ['resources', 'authorities'],
          defaultSegment: 'resources',
        }),
      );

      expect(setNavigationState).toHaveBeenCalledWith({
        [SearchParam.SEGMENT]: 'resources',
      });
    });

    it('initializes state with default source', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() =>
        useSearchSegment({
          flow: 'value',
          segments: ['hubs'],
          defaultSegment: 'hubs',
          defaultSource: 'internal',
        }),
      );

      expect(setNavigationState).toHaveBeenCalledWith({
        [SearchParam.SEGMENT]: 'hubs',
        [SearchParam.SOURCE]: 'internal',
      });
    });

    it('does not initialize when segment already exists in state', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { [SearchParam.SEGMENT]: 'authorities' },
            setNavigationState,
          },
        },
      ]);

      renderHook(() =>
        useSearchSegment({
          flow: 'value',
          segments: ['resources'],
          defaultSegment: 'resources',
        }),
      );

      expect(setNavigationState).not.toHaveBeenCalled();
    });

    it('reads segment from state after initialization', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
      setInitialGlobalState([
        {
          store: useSearchStore,
          state: {
            navigationState: { [SearchParam.SEGMENT]: 'authorities' },
            setNavigationState,
          },
        },
      ]);

      const { result } = renderHook(() =>
        useSearchSegment({
          flow: 'value',
          segments: ['resources', 'authorities'],
        }),
      );

      expect(result.current.currentSegment).toBe('authorities');
    });
  });

  describe('static mode', () => {
    it('uses staticCoreConfigId as default segment when provided', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useSearchSegment({
          flow: 'value',
          staticCoreConfigId: 'static-config-id',
        }),
      );

      expect(result.current.currentSegment).toBe('static-config-id');
      expect(setNavigationState).toHaveBeenCalledWith({
        [SearchParam.SEGMENT]: 'static-config-id',
      });
    });

    it('returns empty string when no segments and no staticCoreConfigId', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      const { result } = renderHook(() =>
        useSearchSegment({
          flow: 'value',
        }),
      );

      expect(result.current.currentSegment).toBe('');
    });
  });

  describe('dynamic vs static mode detection', () => {
    it('uses dynamic mode when segments array is provided', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() =>
        useSearchSegment({
          flow: 'value',
          segments: ['resources'],
          defaultSegment: 'resources',
        }),
      );

      expect(setNavigationState).toHaveBeenCalledWith({
        [SearchParam.SEGMENT]: 'resources',
      });
    });

    it('prefers defaultSegment over first segment in dynamic mode', () => {
      const searchParams = new URLSearchParams();
      (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

      renderHook(() =>
        useSearchSegment({
          flow: 'value',
          segments: ['authorities', 'resources'],
          defaultSegment: 'resources',
        }),
      );

      expect(setNavigationState).toHaveBeenCalledWith({
        [SearchParam.SEGMENT]: 'resources',
      });
    });
  });
});
