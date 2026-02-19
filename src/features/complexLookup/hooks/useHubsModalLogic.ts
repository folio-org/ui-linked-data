import { useCallback } from 'react';

import { useHubAssignment } from '@/features/complexLookup/hooks/useHubAssignment';

interface UseHubsModalLogicParams {
  onAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
  onClose: VoidFunction;
}

interface UseHubsModalLogicResult {
  handleHubAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  isAssigning: boolean;
}

/**
 * Hook to encapsulate hub-specific modal logic
 */
export function useHubsModalLogic({ onAssign, onClose }: UseHubsModalLogicParams): UseHubsModalLogicResult {
  const handleSuccessfulAssignment = useCallback(
    (value: UserValueContents) => {
      onAssign(value);
      onClose();
    },
    [onAssign, onClose],
  );

  const { handleAssign, isAssigning } = useHubAssignment({
    onAssignSuccess: handleSuccessfulAssignment,
  });

  return {
    handleHubAssign: handleAssign,
    isAssigning,
  };
}
