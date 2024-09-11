import state from '@state';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

export const useRecordStatus = () => {
  const lastSavedRecordId = useRecoilValue(state.status.lastSavedRecordId);
  const { resourceId } = useParams();

  const hasBeenSaved = resourceId && resourceId === lastSavedRecordId;

  return {
    hasBeenSaved,
  };
};
