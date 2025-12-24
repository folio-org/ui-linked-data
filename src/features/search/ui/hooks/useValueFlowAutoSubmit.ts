import { useEffect, useRef } from 'react';
import { useSearchState } from '@/store';
import type { SearchFlow } from '../types/provider.types';

interface UseValueFlowAutoSubmitParams {
  flow: SearchFlow;
  onSubmit: () => void;
}

/**
 * Hook to auto-submit search in value flow when committedValues has a query.
 */
export const useValueFlowAutoSubmit = ({ flow, onSubmit }: UseValueFlowAutoSubmitParams) => {
  const { committedValues } = useSearchState(['committedValues']);
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    // Only for value flow
    if (flow !== 'value') return;

    // Only auto-submit once when committedValues has a query
    // This handles the case when modal opens with an initial query
    if (committedValues.query && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      onSubmit();
    }

    // Reset flag when query is cleared (modal closes/resets)
    if (!committedValues.query) {
      hasAutoSubmitted.current = false;
    }
  }, [flow, committedValues.query, onSubmit]);
};
