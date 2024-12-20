import { ChangeEvent, useCallback, useState } from 'react';
import {
  generateEmptyValueUuid,
  generateValidationRequestBody,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
} from '@common/helpers/complexLookup.helper';
import { __MOCK_URI_CHANGE_WHEN_IMPLEMENTING, Authority } from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { useInputsState, useMarcPreviewState, useProfileState, useStatusState, useUIState } from '@src/store';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';
import { AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT } from '@common/constants/api.constants';
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
  const { schema } = useProfileState();
  const { selectedEntries, setSelectedEntries } = useInputsState();
  const {
    complexValue,
    setComplexValue,
    resetComplexValue: resetMarcPreviewData,
    metadata: marcPreviewMetadata,
    resetMetadata: resetMarcPreviewMetadata,
  } = useMarcPreviewState();
  const { resetIsMarcPreviewOpen } = useUIState();
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const { fetchMarcData } = useMarcData(setComplexValue);
  const { uuid, linkedEntry } = entry;
  const linkedField = getLinkedField({ schema, linkedEntry });
  const { makeRequest } = useApi();
  const { addStatusMessagesItem } = useStatusState();
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

  const validateMarcRecord = (marcData: MarcDTO | null) => {
    const { endpoints, validationTarget } = lookupConfig.api;

    return makeRequest({
      url: endpoints.validation ?? AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
      method: 'POST',
      body: generateValidationRequestBody(marcData, validationTarget?.[authority]),
    });
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

  const handleAssign = async ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => {
    let srsId;
    let marcData = complexValue;

    if (marcPreviewMetadata?.baseId === id) {
      srsId = marcPreviewMetadata.srsId;
    } else {
      const response = await fetchMarcData(id, lookupConfig.api.endpoints.marcPreview);

      if (response) {
        marcData = response;
        srsId = marcData?.matchedId;
      }
    }

    const isValid = await validateMarcRecord(marcData);

    if (isValid) {
      assignMarcRecord({ id, title, srsId, linkedFieldValue });
      clearFailedEntryIds();
      reset();
      closeModal();
    } else {
      addFailedEntryId(id);

      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.errorValidatingAuthorityRecord'),
      );
    }
  };

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
