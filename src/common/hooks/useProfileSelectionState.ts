import { useEffect, useState } from 'react';
import { getRecordProfileId } from '@common/helpers/record.helper';
import { useInputsState } from '@src/store';

interface UseProfileSelectionStateProps {
  isModalOpen: boolean;
  action: string;
}

export const useProfileSelectionState = ({ isModalOpen, action }: UseProfileSelectionStateProps) => {
  const { record } = useInputsState(['record']);
  const [selectedProfileId, setSelectedProfileId] = useState<string | number | null | undefined>(null);

  // Update selected profile ID when modal opens or record/action changes
  useEffect(() => {
    if (!isModalOpen) return;

    const currentProfileId = action === 'change' ? getRecordProfileId(record) : null;
    setSelectedProfileId(currentProfileId);
  }, [isModalOpen, action, record]);

  return {
    selectedProfileId,
    setSelectedProfileId,
  };
};
