import { useState, useEffect, useMemo, useCallback } from 'react';
import { ComplexLookupType } from '@/features/complexLookup/constants/complexLookup.constants';
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
  handleAssign: (record: ComplexLookupAssignRecordDTO) => void;
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
    (record: ComplexLookupAssignRecordDTO) => {
      // Update field value with assigned record
      const newValue = [
        {
          id: record.id,
          label: record.title,
          meta: {},
        },
      ];

      setLocalValue(newValue);
      onChange(uuid, newValue);
      setIsModalOpen(false);
    },
    [uuid, onChange],
  );

  const handleDelete = useCallback(
    (id?: string) => {
      if (!id) return;

      const newValue = localValue.filter(value => value.id !== id);

      setLocalValue(newValue);
      onChange(uuid, newValue);
    },
    [localValue, uuid, onChange],
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
