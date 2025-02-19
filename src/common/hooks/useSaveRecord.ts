import { useSearchParams } from 'react-router-dom';
import { useRecordStatus } from '@common/hooks/useRecordStatus';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { useModalControls } from '@common/hooks/useModalControls';
import { QueryParams } from '@common/constants/routes.constants';
import { useStatusState } from '@src/store';

export const useSaveRecord = (primary: boolean) => {
  const { isRecordEdited } = useStatusState();
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
