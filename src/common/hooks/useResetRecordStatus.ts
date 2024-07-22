import { RecordStatus } from '@common/constants/record.constants';
import state from '@state';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export const useResetRecordStatus = () => {
  const setRecordStatus = useSetRecoilState(state.status.recordStatus);
  const [prevResourceId, setPrevResourceId] = useState<string | null>(null);
  const { resourceId } = useParams();

  // TODO: temporary, might have to revise considering all edge cases
  useEffect(() => {
    if (resourceId) {
      if (prevResourceId && prevResourceId !== resourceId) {
        setRecordStatus({ type: RecordStatus.open });
      }

      setPrevResourceId(resourceId);
    } else {
      setRecordStatus({ type: RecordStatus.open });
    }
  }, [resourceId]);
};
