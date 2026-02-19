import { useCallback } from 'react';

import { StatusType } from '@/common/constants/status.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { LOOKUP_TYPES } from '@/features/complexLookup/constants/complexLookup.constants';

import { useStatusState } from '@/store';

import { useHubImportAssignmentMutation } from './useHubImportAssignmentMutation';

interface UseHubAssignmentParams {
  onAssignSuccess: (value: UserValueContents) => void;
}

interface UseHubAssignmentResult {
  handleAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  isAssigning: boolean;
}

/**
 * Hook for orchestrating hub assignment with import-on-assign logic.
 * External hubs are imported before assignment to ensure a local resource exists.
 * Local hubs are assigned directly using their existing id.
 */
export function useHubAssignment({ onAssignSuccess }: UseHubAssignmentParams): UseHubAssignmentResult {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { importForAssignment, isPending } = useHubImportAssignmentMutation();

  const handleAssign = useCallback(
    async (record: ComplexLookupAssignRecordDTO) => {
      // Guard against concurrent calls
      if (isPending) return;

      const { id, title, uri, sourceType } = record;

      try {
        let assignId = id;

        // External hubs require import to generate a local resource id
        if (sourceType !== 'local' && uri) {
          const { importedId } = await importForAssignment({ hubUri: uri });

          assignId = importedId;
        }

        const assignedValue: UserValueContents = {
          id: assignId,
          label: title,
          meta: {
            type: AdvancedFieldType.complex,
            uri,
            sourceType,
            lookupType: LOOKUP_TYPES.HUBS,
          },
        };

        onAssignSuccess(assignedValue);
      } catch {
        addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.errorImportingHub'));
      }
    },
    [isPending, importForAssignment, onAssignSuccess, addStatusMessagesItem],
  );

  return {
    handleAssign,
    isAssigning: isPending,
  };
}
