import { useStoreSelector } from '@common/hooks/useStoreSelectors';
import { useParams } from 'react-router-dom';

export const useRecordStatus = () => {
  const { lastSavedRecordId } = useStoreSelector().status;
  const { resourceId } = useParams();

  const hasBeenSaved = resourceId && resourceId === lastSavedRecordId;

  return {
    hasBeenSaved,
  };
};
