import { useParams } from 'react-router-dom';

import { useStatusState } from '@/store';

export const useRecordStatus = () => {
  const { lastSavedRecordId } = useStatusState(['lastSavedRecordId']);
  const { resourceId } = useParams();

  const hasBeenSaved = resourceId && resourceId === lastSavedRecordId;

  return {
    hasBeenSaved,
  };
};
