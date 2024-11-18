import { ChangeEvent, useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  generateEmptyValueUuid,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
} from '@common/helpers/complexLookup.helper';
import { __MOCK_URI_CHANGE_WHEN_IMPLEMENTING } from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import state from '@state';
import { useModalControls } from './useModalControls';
import { useMarcData } from './useMarcData';
import { useServicesContext } from './useServicesContext';

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
  const schema = useRecoilValue(state.config.schema);
  const marcPreviewMetadata = useRecoilValue(state.data.marcPreviewMetadata);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const resetMarcPreviewData = useResetRecoilState(state.data.marcPreviewData);
  const resetMarcPreviewMetadata = useResetRecoilState(state.data.marcPreviewMetadata);
  const resetIsMarcPreviewOpen = useResetRecoilState(state.ui.isMarcPreviewOpen);
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
  const { fetchMarcData } = useMarcData(state.data.marcPreviewData);
  const { uuid, linkedEntry } = entry;
  const linkedField = getLinkedField({ schema, linkedEntry });

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

  const handleAssign = async ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => {
    let srsId;

    if (marcPreviewMetadata?.baseId === id) {
      srsId = marcPreviewMetadata.srsId;
    } else {
      const marcData = await fetchMarcData(id, lookupConfig.api.endpoints.marcPreview);

      srsId = marcData?.matchedId;
    }

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

    resetMarcPreviewData();
    resetMarcPreviewMetadata();
    resetIsMarcPreviewOpen();
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
