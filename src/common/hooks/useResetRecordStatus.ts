import { RecordStatus } from '@common/constants/record.constants';
import state from '@state';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

export const useResetRecordStatus = () => {
  const [recordStatus, setRecordStatus] = useRecoilState(state.status.recordStatus);
  const [prevResourceId, setPrevResourceId] = useState<string | null>(null);
  const { resourceId } = useParams();
  const setRecordStatusAsOpen = () => setRecordStatus({ type: RecordStatus.open });

  // TODO: temporary, might have to revise considering all edge cases
  useEffect(() => {
    if (!recordStatus?.type) {
      setRecordStatusAsOpen();
    }

    if (resourceId) {
      if (prevResourceId && prevResourceId !== resourceId) {
        setRecordStatusAsOpen();
      }

      setPrevResourceId(resourceId);
    } else {
      setRecordStatusAsOpen();
    }
  }, [resourceId]);
};
