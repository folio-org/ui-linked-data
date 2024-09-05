import { ChangeEvent, useCallback, useContext, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  generateEmptyValueUuid,
  getLinkedField,
  getUpdatedSelectedEntries,
  updateLinkedFieldValue,
} from '@common/helpers/complexLookup.helper';
import { __MOCK_URI_CHANGE_WHEN_IMPLEMENTING } from '@common/constants/complexLookup.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { ServicesContext } from '@src/contexts';
import state from '@state';
import { useModalControls } from './useModalControls';

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
  const { selectedEntriesService } = useContext(ServicesContext) as Required<ServicesParams>;
  const [localValue, setLocalValue] = useState<UserValueContents[]>(value || []);
  const schema = useRecoilValue(state.config.schema);
  const [selectedEntries, setSelectedEntries] = useRecoilState(state.config.selectedEntries);
  const { isModalOpen, setIsModalOpen, openModal } = useModalControls();
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

  const handleAssign = ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => {
    const newValue = {
      id,
      label: title,
      meta: {
        type: AdvancedFieldType.complex,
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
