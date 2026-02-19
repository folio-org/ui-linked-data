import { useCallback, useState } from 'react';

import { StatusType } from '@/common/constants/status.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { useServicesContext } from '@/common/hooks/useServicesContext';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { LOOKUP_TYPES } from '@/features/complexLookup/constants/complexLookup.constants';

import { useInputsState, useMarcPreviewState, useProfileState, useStatusState } from '@/store';

import { ModalConfig } from '../configs/modalRegistry';
import { getLinkedField, getUpdatedSelectedEntries, updateLinkedFieldValue } from '../utils/complexLookup.helper';
import { useComplexLookupValidation } from './useComplexLookupValidation';
import { useMarcAssignment } from './useMarcAssignment';
import { useMarcValidation } from './useMarcValidation';

interface UseAuthoritiesAssignmentParams {
  entry: SchemaEntry;
  lookupContext: string;
  modalConfig: ModalConfig;
  onAssignSuccess: (value: UserValueContents) => void;
  enabled?: boolean;
}

interface UseAuthoritiesAssignmentResult {
  handleAssign: (record: ComplexLookupAssignRecordDTO) => Promise<void>;
  isAssigning: boolean;
  checkFailedId: (id?: string) => boolean;
}

export function useAuthoritiesAssignment({
  entry,
  lookupContext,
  modalConfig,
  onAssignSuccess,
  enabled = true,
}: UseAuthoritiesAssignmentParams): UseAuthoritiesAssignmentResult {
  const [isAssigning, setIsAssigning] = useState(false);

  const { selectedEntriesService } = useServicesContext() as Required<ServicesParams>;
  const { schema } = useProfileState(['schema']);
  const { selectedEntries, setSelectedEntries } = useInputsState(['selectedEntries', 'setSelectedEntries']);
  const {
    complexValue: marcPreviewData,
    setComplexValue: setMarcPreviewData,
    metadata: marcPreviewMetadata,
    resetComplexValue: resetMarcPreviewData,
    resetMetadata: resetMarcPreviewMetadata,
  } = useMarcPreviewState(['complexValue', 'setComplexValue', 'metadata', 'resetComplexValue', 'resetMetadata']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { validateMarcRecord } = useMarcValidation();
  const { getMarcDataForAssignment } = useMarcAssignment(setMarcPreviewData);
  const { addFailedEntryId, clearFailedEntryIds, checkFailedId } = useComplexLookupValidation();
  const { linkedEntry } = entry;
  const linkedField = getLinkedField({ schema, linkedEntry });

  const updateLinkedDropdown = useCallback(
    (linkedFieldValue: string) => {
      if (!linkedField || !selectedEntriesService) return;

      const updatedValue = updateLinkedFieldValue({
        schema,
        linkedField,
        linkedFieldValue,
        modalConfig,
      });

      if (!updatedValue) return;

      const updatedSelectedEntries = getUpdatedSelectedEntries({
        selectedEntriesService,
        selectedEntries,
        linkedFieldChildren: linkedField.children,
        newValue: updatedValue.uuid,
      });

      setSelectedEntries(updatedSelectedEntries);
    },
    [schema, linkedField, modalConfig, selectedEntriesService, selectedEntries, setSelectedEntries],
  );

  const handleAssignmentError = useCallback(
    (id: string, invalidAssignmentReason?: string) => {
      addFailedEntryId(id);

      const reason = invalidAssignmentReason?.toLowerCase() || 'general';
      const messageKey = `ld.errorAssigningAuthority.${reason}`;

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, messageKey));
    },
    [addFailedEntryId, addStatusMessagesItem],
  );

  const handleAssign = useCallback(
    async (record: ComplexLookupAssignRecordDTO) => {
      if (!enabled) {
        return;
      }

      const { id, title, linkedFieldValue } = record;

      if (isAssigning) return;

      setIsAssigning(true);

      try {
        const { srsId, marcData } = await getMarcDataForAssignment(id, {
          complexValue: marcPreviewData,
          marcPreviewMetadata,
          marcPreviewEndpoint: modalConfig.api?.endpoints?.marcPreview,
        });
        const { validAssignment, invalidAssignmentReason } = await validateMarcRecord(
          marcData,
          modalConfig,
          lookupContext,
        );

        if (!validAssignment) {
          handleAssignmentError(id, invalidAssignmentReason);
          setIsAssigning(false);
          return;
        }

        const assignedValue: UserValueContents = {
          id,
          label: title,
          meta: {
            type: AdvancedFieldType.complex,
            srsId,
            lookupType: LOOKUP_TYPES.AUTHORITIES,
          },
        };

        if (linkedEntry?.dependent && linkedFieldValue && linkedField && selectedEntriesService) {
          updateLinkedDropdown(linkedFieldValue);
        }

        clearFailedEntryIds();
        resetMarcPreviewData();
        resetMarcPreviewMetadata();
        onAssignSuccess(assignedValue);
      } catch {
        handleAssignmentError(id);
      } finally {
        setIsAssigning(false);
      }
    },
    [
      enabled,
      isAssigning,
      getMarcDataForAssignment,
      validateMarcRecord,
      marcPreviewData,
      marcPreviewMetadata,
      modalConfig,
      lookupContext,
      linkedEntry,
      linkedField,
      selectedEntriesService,
      clearFailedEntryIds,
      resetMarcPreviewData,
      resetMarcPreviewMetadata,
      onAssignSuccess,
      updateLinkedDropdown,
      handleAssignmentError,
    ],
  );

  return {
    handleAssign,
    isAssigning,
    checkFailedId,
  };
}
