import { useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchState } from '@/store';
import { SearchParam } from '../../core';
import type { SearchFlow } from '../types/provider.types';

interface UseSearchSegmentParams {
  flow: SearchFlow;
  segments?: string[];
  defaultSegment?: string;
  defaultSource?: string;
  // For static mode: the config id to use as segment
  staticConfigId?: string;
}

interface UseSearchSegmentResult {
  currentSegment: string;
  currentSource: string | undefined;
}

/**
 * Hook to manage segment and source state.
 * Handles initialization for value flow and reads from URL for url flow.
 */
export function useSearchSegment({
  flow,
  segments,
  defaultSegment,
  defaultSource,
  staticConfigId,
}: UseSearchSegmentParams): UseSearchSegmentResult {
  const [searchParams] = useSearchParams();
  const { navigationState, setNavigationState } = useSearchState(['navigationState', 'setNavigationState']);
  const isInitialized = useRef(false);

  const isDynamicMode = Boolean(segments?.length);

  // Get current segment from URL or state
  const getSegmentFromState = (): string | undefined => {
    if (flow === 'url') {
      return searchParams.get(SearchParam.SEGMENT) ?? undefined;
    }

    return (navigationState as Record<string, unknown>)?.[SearchParam.SEGMENT] as string | undefined;
  };

  // Get current source from URL or state
  const getSourceFromState = (): string | undefined => {
    if (flow === 'url') {
      return searchParams.get(SearchParam.SOURCE) ?? undefined;
    }

    return (navigationState as Record<string, unknown>)?.[SearchParam.SOURCE] as string | undefined;
  };

  // Compute the default segment
  const computedDefaultSegment = useMemo(() => {
    if (isDynamicMode && segments) {
      return defaultSegment ?? segments[0];
    }

    return staticConfigId ?? '';
  }, [isDynamicMode, segments, defaultSegment, staticConfigId]);

  // Initialize segment/source on mount (value flow only)
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Skip if we already have segment from URL or state
    if (getSegmentFromState()) return;

    // Only initialize state for value flow
    if (flow === 'value') {
      const initialState: Record<string, unknown> = {};

      if (computedDefaultSegment) {
        initialState[SearchParam.SEGMENT] = computedDefaultSegment;
      }

      if (defaultSource) {
        initialState[SearchParam.SOURCE] = defaultSource;
      }

      if (Object.keys(initialState).length > 0) {
        setNavigationState(initialState as SearchParamsState);
      }
    }
  }, []);

  // Resolve current segment
  const currentSegment = useMemo(() => {
    return getSegmentFromState() ?? computedDefaultSegment;
  }, [searchParams, navigationState, computedDefaultSegment]);

  // Resolve current source
  const currentSource = useMemo(() => {
    return getSourceFromState();
  }, [searchParams, navigationState]);

  return { currentSegment, currentSource };
}
