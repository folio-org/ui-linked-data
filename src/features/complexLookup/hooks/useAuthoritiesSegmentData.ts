import { useCallback, useEffect, useRef } from 'react';
import { useSearchState, useLoadingState } from '@/store';
import { useAuthoritiesDataQueries } from './useAuthoritiesDataQueries';
import { logger } from '@/common/services/logger';

interface AuthoritiesSegmentDataConfig {
  sourceEndpoint: string;
  facetsEndpoint: string;
  sourceKey: string;
  facet?: string;
  autoLoadOnMount?: boolean;
  isOpen?: boolean;
}

/**
 * Hook to manage Authorities-specific data loading on segment changes.
 * Orchestrates when and how data is fetched using useAuthoritiesDataQueries.
 */
export function useAuthoritiesSegmentData(config: AuthoritiesSegmentDataConfig) {
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
    sourceEndpoint: config.sourceEndpoint,
    facetsEndpoint: config.facetsEndpoint,
    facet: config.facet,
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
    if (config.autoLoadOnMount && config.isOpen && !hasLoadedInitialData.current) {
      hasLoadedInitialData.current = true;

      onSegmentEnter().catch(error => {
        logger.error('Failed to auto-load initial segment data:', error);
      });
    }

    // Reset flag when modal closes
    if (!config.isOpen) {
      hasLoadedInitialData.current = false;
    }
  }, [config.autoLoadOnMount, config.isOpen, onSegmentEnter]);

  return {
    sourceData,
    facetsData,
    isLoading: isQueriesLoading,
    onSegmentEnter,
    refetchSource,
    refetchFacets,
  };
}
