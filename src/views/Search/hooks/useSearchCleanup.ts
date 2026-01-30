import { useEffect } from 'react';

import { useContainerEvents } from '@/common/hooks/useContainerEvents';

import { useSearchState, useUIState } from '@/store';

/**
 * Custom hook that handles search component lifecycle and cleanup operations
 */
export const useSearchCleanup = () => {
  const { dispatchDropNavigateToOriginEvent } = useContainerEvents();
  const { resetSelectedInstances } = useSearchState(['resetSelectedInstances']);
  const { resetFullDisplayComponentType } = useUIState(['resetFullDisplayComponentType']);

  // Dispatch navigation event on mount
  dispatchDropNavigateToOriginEvent();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetFullDisplayComponentType();
      resetSelectedInstances();
    };
  }, [resetFullDisplayComponentType, resetSelectedInstances]);
};
