import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { RecordStatus } from '@/common/constants/record.constants';

import { useStatusState } from '@/store';

export const useResetRecordStatus = () => {
  const { recordStatus, setRecordStatus } = useStatusState(['recordStatus', 'setRecordStatus']);
  const [prevResourceId, setPrevResourceId] = useState<string | null>(null);
  const { resourceId } = useParams();
  const setRecordStatusAsOpen = () => setRecordStatus({ type: RecordStatus.open });

  // TODO: UILD-444 - temporary, might have to revise considering all edge cases
  useEffect(() => {
    if (!recordStatus?.type || !prevResourceId) {
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
