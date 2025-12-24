import { useState, useEffect, useMemo, useCallback } from 'react';
import { ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';
import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { logger } from '@/common/services/logger';
import { getModalConfig, getButtonLabel } from '../configs/modalRegistry';

interface UseComplexLookupFieldParams {
  value?: UserValueContents[];
  lookupType?: ComplexLookupType;
  uuid: string;
  onChange: (uuid: string, contents: Array<UserValueContents>) => void;
}

interface UseComplexLookupFieldReturn {
  localValue: UserValueContents[];
  isModalOpen: boolean;
  modalConfig: ReturnType<typeof getModalConfig> | null;
  buttonLabelId: string;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleAssign: (value: UserValueContents | ComplexLookupAssignRecordDTO) => void;
  handleDelete: (id?: string) => void;
}

/**
 * Custom hook to manage complex lookup field state and interactions.
 * Handles modal state, value synchronization, and user actions.
 */
export function useComplexLookupField({
  value,
  lookupType,
  uuid,
  onChange,
}: UseComplexLookupFieldParams): UseComplexLookupFieldReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localValue, setLocalValue] = useState<UserValueContents[]>(value ?? []);

  // Get modal configuration from registry
  const modalConfig = useMemo(() => {
    if (!lookupType) return null;

    try {
      return getModalConfig(lookupType);
    } catch (error) {
      logger.error('Failed to load modal config:', error);

      return null;
    }
  }, [lookupType]);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value ?? []);
  }, [value]);

  // Modal handlers
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAssign = useCallback(
    (valueOrRecord: UserValueContents | ComplexLookupAssignRecordDTO) => {
      let newValue: UserValueContents;

      if ('meta' in valueOrRecord && valueOrRecord.meta !== undefined) {
        newValue = valueOrRecord;
      } else {
        const record = valueOrRecord as ComplexLookupAssignRecordDTO;

        newValue = {
          id: record.id,
          label: record.title,
          meta: {
            type: AdvancedFieldType.complex,
            uri: record.uri,
          },
        };
      }

      setLocalValue([newValue]);
      onChange(uuid, [newValue]);
      setIsModalOpen(false);
    },
    [uuid, onChange],
  );

  const handleDelete = useCallback(
    (id?: string) => {
      if (!id) return;

      setLocalValue([]);
      onChange(uuid, []);
    },
    [uuid, onChange],
  );

  // Get button label using registry
  const buttonLabelId = useMemo(() => {
    if (!lookupType) return 'ld.add';

    return getButtonLabel(lookupType, !!localValue?.length);
  }, [lookupType, localValue?.length]);

  return {
    localValue,
    isModalOpen,
    modalConfig,
    buttonLabelId,
    handleOpenModal,
    handleCloseModal,
    handleAssign,
    handleDelete,
  };
}
