import { useCallback, useEffect, useRef } from 'react';

import { logger } from '@/common/services/logger';

import { useLoadingState, useSearchState } from '@/store';

import { useAuthoritiesDataQueries } from './useAuthoritiesDataQueries';

interface AuthoritiesSegmentDataConfig {
  sourceEndpoint?: string;
  facetsEndpoint?: string;
  facet?: string;
  autoLoadOnMount?: boolean;
  isOpen?: boolean;
}

/**
 * Hook to manage Authorities-specific data loading on segment changes.
 * Orchestrates when and how data is fetched using useAuthoritiesDataQueries.
 */
export function useAuthoritiesSegmentData({
  sourceEndpoint,
  facetsEndpoint,
  facet,
  autoLoadOnMount,
  isOpen,
}: AuthoritiesSegmentDataConfig) {
  const { setSourceData } = useSearchState(['setSourceData']);
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const hasLoadedInitialData = useRef(false);
  const {
    sourceData,
    facetsData,
    refetchSource,
    refetchFacets,
    isLoading: isQueriesLoading,
  } = useAuthoritiesDataQueries({
    sourceEndpoint,
    facetsEndpoint,
    facet,
  });

  const onSegmentEnter = useCallback(async () => {
    try {
      setIsLoading(true);

      const sourceResult = await refetchSource();

      if (sourceResult.data) {
        setSourceData(sourceResult.data as SourceDataDTO);
      }

      await refetchFacets();
    } catch (error) {
      logger.error('Failed to load authorities segment data:', error);

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refetchSource, refetchFacets, setSourceData, setIsLoading]);

  // Auto-load data when modal opens if configured.
  useEffect(() => {
    if (autoLoadOnMount && isOpen && !hasLoadedInitialData.current) {
      hasLoadedInitialData.current = true;

      onSegmentEnter().catch(error => {
        logger.error('Failed to auto-load initial segment data:', error);
      });
    }

    // Reset flag when modal closes
    if (!isOpen) {
      hasLoadedInitialData.current = false;
    }
  }, [autoLoadOnMount, isOpen, onSegmentEnter]);

  return {
    sourceData,
    facetsData,
    isLoading: isQueriesLoading,
    onSegmentEnter,
    refetchSource,
    refetchFacets,
  };
}
