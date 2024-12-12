import { useStatusState } from '@src/store';
import { useParams } from 'react-router-dom';

export const useRecordStatus = () => {
  const { lastSavedRecordId } = useStatusState();
  const { resourceId } = useParams();

  const hasBeenSaved = resourceId && resourceId === lastSavedRecordId;

  return {
    hasBeenSaved,
  };
};
