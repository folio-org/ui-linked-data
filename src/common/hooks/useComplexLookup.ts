import { ChangeEvent, useCallback, useState } from 'react';
import {
  generateEmptyValueUuid,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
  validateMarcRecord,
  getMarcDataForAssignment,
} from '@common/helpers/complexLookup.helper';
import { __MOCK_URI_CHANGE_WHEN_IMPLEMENTING, Authority } from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { useInputsState, useMarcPreviewState, useProfileState, useStatusState, useUIState } from '@src/store';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import { useModalControls } from './useModalControls';
import { useMarcData } from './useMarcData';
import { useServicesContext } from './useServicesContext';
import { useApi } from './useApi';
import { useComplexLookupValidation } from './useComplexLookupValidation';

export const useComplexLookup = ({
  entry,
  value,
  lookupConfig,
  authority = Authority.Creator,
  onChange,
}: {
  entry: SchemaEntry;
  value?: UserValueContents[];
  lookupConfig: ComplexLookupsConfigEntry;
  authority?: string;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}) => {
  const { selectedEntriesService } = useServicesContext() as Required<ServicesParams>;
  const [localValue, setLocalValue] = useState<UserValueContents[]>(value || []);
  const { schema } = useProfileState(['schema']);
  const { selectedEntries, setSelectedEntries } = useInputsState(['selectedEntries', 'setSelectedEntries']);
  const {
    complexValue,
    setComplexValue,
    resetComplexValue: resetMarcPreviewData,
    metadata: marcPreviewMetadata,
    resetMetadata: resetMarcPreviewMetadata,
  } = useMarcPreviewState(['complexValue', 'setComplexValue', 'resetComplexValue', 'metadata', 'resetMetadata']);
  const { resetIsMarcPreviewOpen } = useUIState(['resetIsMarcPreviewOpen']);
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const { fetchMarcData } = useMarcData(setComplexValue);
  const { uuid, linkedEntry } = entry;
  const linkedField = getLinkedField({ schema, linkedEntry });
  const { makeRequest } = useApi();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { addFailedEntryId, clearFailedEntryIds } = useComplexLookupValidation();

  const handleDelete = (id?: string) => {
    onChange(uuid, []);
    setLocalValue(prevValue => prevValue.filter(({ id: prevId }) => prevId !== id));

    if (!(linkedField && selectedEntriesService)) return;

    const updatedSelectedEntries = getUpdatedSelectedEntries({
      selectedEntriesService,
      selectedEntries,
      linkedFieldChildren: linkedField.children,
      newValue: generateEmptyValueUuid(linkedField.uuid),
    });

    setSelectedEntries(updatedSelectedEntries);
  };

  const closeModal = useCallback(() => {
    clearFailedEntryIds();
    setIsModalOpen(false);
  }, []);

  const reset = () => {
    resetMarcPreviewData();
    resetMarcPreviewMetadata();
    resetIsMarcPreviewOpen();
  };

  const assignMarcRecord = ({
    id,
    title,
    srsId,
    linkedFieldValue,
  }: {
    id: string;
    title: string;
    srsId?: string;
    linkedFieldValue?: string;
  }) => {
    const newValue = {
      id,
      label: title,
      meta: {
        type: AdvancedFieldType.complex,
        srsId,
      },
    };

    onChange(uuid, [newValue]);
    setLocalValue([newValue]);

    // Has an associated dependent subfield.
    // For now we assume that the associated field's type is Dropdown only
    if (linkedEntry?.dependent && linkedFieldValue) {
      const updatedValue = updateLinkedFieldValue({ schema, linkedField, linkedFieldValue, lookupConfig });
      const updatedSelectedEntries = getUpdatedSelectedEntries({
        selectedEntriesService,
        selectedEntries,
        linkedFieldChildren: linkedField?.children,
        newValue: updatedValue?.uuid,
      });

      setSelectedEntries(updatedSelectedEntries);
    }
  };

  const handleSimpleAssign = useCallback(
    ({ id, title, uri }: Pick<ComplexLookupAssignRecordDTO, 'id' | 'title' | 'uri'>) => {
      const newValue = {
        id,
        label: title,
        meta: {
          type: AdvancedFieldType.complex,
          uri,
        },
      };

      onChange(uuid, [newValue]);
      setLocalValue([newValue]);
      reset();
      closeModal();
    },
    [uuid, onChange, reset, closeModal],
  );

  const handleComplexAssign = useCallback(
    async ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => {
      try {
        const { srsId, marcData } = await getMarcDataForAssignment(id, {
          complexValue,
          marcPreviewMetadata,
          fetchMarcData,
          marcPreviewEndpoint: lookupConfig.api?.endpoints?.marcPreview,
        });
        const { validAssignment, invalidAssignmentReason } = await validateMarcRecord(
          marcData,
          lookupConfig,
          authority,
          makeRequest,
        );

        if (validAssignment) {
          assignMarcRecord({ id, title, srsId, linkedFieldValue });
          clearFailedEntryIds();
          reset();
          closeModal();
        } else {
          handleAssignmentValidationError(id, invalidAssignmentReason);
        }
      } catch {
        handleAssignmentError(id);
      }
    },
    [
      complexValue,
      marcPreviewMetadata,
      fetchMarcData,
      lookupConfig,
      authority,
      makeRequest,
      assignMarcRecord,
      clearFailedEntryIds,
      reset,
      closeModal,
    ],
  );

  const handleAssignmentValidationError = useCallback(
    (id: string, invalidAssignmentReason?: string) => {
      addFailedEntryId(id);

      let messageKey = 'ld.errorAssigningAuthority';

      if (invalidAssignmentReason) {
        messageKey += `.${invalidAssignmentReason.toLowerCase()}`;
      }

      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, messageKey));
    },
    [addFailedEntryId, addStatusMessagesItem],
  );

  const handleAssignmentError = useCallback(
    (id: string) => {
      addFailedEntryId(id);
      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.errorAssigningAuthority.general'),
      );
    },
    [addFailedEntryId, addStatusMessagesItem],
  );

  const handleAssign = useCallback(
    async (data: ComplexLookupAssignRecordDTO, hasSimpleFlow = false) => {
      if (hasSimpleFlow) {
        return handleSimpleAssign(data);
      }

      return handleComplexAssign(data);
    },
    [handleSimpleAssign, handleComplexAssign],
  );

  const handleOnChangeBase = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      label: value,
      meta: {
        uri: __MOCK_URI_CHANGE_WHEN_IMPLEMENTING,
      },
    };

    onChange(uuid, [newValue]);
    setLocalValue(prevValue => [...prevValue, newValue]);
  };

  return {
    localValue,
    isModalOpen,
    openModal,
    closeModal,
    handleDelete,
    handleAssign,
    handleOnChangeBase,
  };
};
