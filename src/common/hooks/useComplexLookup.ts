import { ChangeEvent, useCallback, useState } from 'react';
import {
  generateEmptyValueUuid,
  generateValidationRequestBody,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
} from '@common/helpers/complexLookup.helper';
import { __MOCK_URI_CHANGE_WHEN_IMPLEMENTING } from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { useModalControls } from './useModalControls';
import { useMarcData } from './useMarcData';
import { useServicesContext } from './useServicesContext';
import { useInputsState, useMarcPreviewState, useProfileState, useStatusState, useUIState } from '@src/store';
import { useApi } from './useApi';
import { UserNotificationFactory } from '@common/services/userNotification';
import { StatusType } from '@common/constants/status.constants';

export const useComplexLookup = ({
  entry,
  value,
  lookupConfig,
  onChange,
}: {
  entry: SchemaEntry;
  value?: UserValueContents[];
  lookupConfig: ComplexLookupsConfigEntry;
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
    setIsModalOpen(false);
  }, []);

  const reset = () => {
    resetMarcPreviewData();
    resetMarcPreviewMetadata();
    resetIsMarcPreviewOpen();
  };

  const validateMarcRecord = async (marcData: MarcDTO | null) => {
    return await makeRequest({
      url: '/linked-data/authority-assignment-check',
      method: 'POST',
      body: generateValidationRequestBody(marcData),
      requestParams: {
        headers: {
          'content-type': 'application/json',
        },
      },
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
    } else {
      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.errorValidatingAuthorityRecord'),
      );
    }

    reset();
    closeModal();
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
