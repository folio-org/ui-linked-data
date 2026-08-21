import { useSearchParams } from 'react-router-dom';

import { QueryParams } from '@/common/constants/routes.constants';
import { useModalControls } from '@/common/hooks/useModalControls';

import { useRecordMutations } from '@/features/resources';

import { useStatusState } from '@/store';

export const useSaveRecord = (primary: boolean) => {
  const { isRecordEdited } = useStatusState(['isRecordEdited']);
  const { saveRecord } = useRecordMutations();
  const { isModalOpen, openModal, closeModal } = useModalControls();
  const [searchParams] = useSearchParams();

  const isButtonDisabled = !searchParams.get(QueryParams.CloneOf) && !isRecordEdited;

  return {
    isButtonDisabled,
    isModalOpen,
    openModal,
    closeModal,
    saveRecord: () => saveRecord({ isNavigatingBack: primary }),
  };
};
