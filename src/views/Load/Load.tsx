import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { getAllRecords, getRecord } from '../../common/api/records.api';
import useConfig from '../../common/hooks/useConfig.hook';
import state from '../../state/state';

import './Load.scss';

export const Load = () => {
  const [availableRecords, setAvailableRecords] = useState<Record<string, any> | null>(null);
  const setRecord = useSetRecoilState(state.inputs.record);

  const { getProfiles } = useConfig();

  useEffect(() => {
    getAllRecords({
      pageNumber: 0,
    })
      .then(res => {
        setAvailableRecords(res?.content);
      })
      .catch(err => console.error('Error fetching record list: ', err));
  }, []);

  const fetchRecord = async (recordId: string) => {
    try {
      const record: RecordEntry = await getRecord({ recordId });

      // TODO: refactor when the new schema and different build flow is available
      setRecord(record);
      getProfiles();
    } catch (err) {
      console.error('Error fetching record: ', err);
    }
  };

  return (
    <div className="load">
      <strong>BIBFRAME Profiles:</strong>
      <div>
        <button>Monograph</button>
      </div>
      <strong>Available records:</strong>
      <div className="button-group">
        {availableRecords?.map(({ id }: RecordEntry) => (
          <button key={id} onClick={() => fetchRecord(String(id))}>
            {`Record ID: ${id}`}
          </button>
        )) || <div>No available records</div>}
      </div>
    </div>
  );
};
