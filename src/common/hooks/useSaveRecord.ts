import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { useModalControls } from '@/common/hooks/useModalControls';
import { useRecordControls } from '@/common/hooks/useRecordControls';
import { useRecordStatus } from '@/common/hooks/useRecordStatus';

import { useStatusState } from '@/store';

export const useSaveRecord = (primary: boolean) => {
  const { isRecordEdited } = useStatusState(['isRecordEdited']);
  const { hasBeenSaved } = useRecordStatus();
  const { saveRecord } = useRecordControls();
  const { isModalOpen, openModal, closeModal } = useModalControls();
  const [searchParams] = useSearchParams();

  const isButtonDisabled = !searchParams.get(QueryParams.CloneOf) && !hasBeenSaved && !isRecordEdited;

  return {
    isButtonDisabled,
    isModalOpen,
    openModal,
    closeModal,
    saveRecord: () => saveRecord({ isNavigatingBack: primary }),
  };
};
