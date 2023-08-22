import { useEffect, useState } from 'react';
import { getAllRecords } from '@common/api/records.api';
import './Load.scss';
import { useRecordControls } from '@common/hooks/useRecordControls';
import { FormattedMessage } from 'react-intl';

export const Load = () => {
  const [availableRecords, setAvailableRecords] = useState<Record<string, any> | null>(null);

  const { fetchRecord } = useRecordControls();

  useEffect(() => {
    getAllRecords({
      pageNumber: 0,
    })
      .then(res => {
        setAvailableRecords(res?.content);
      })
      .catch(err => console.error('Error fetching record list: ', err));
  }, []);

  // TODO: Workaroud for demo; define type and format for data received from API
  const generateButtonLabel = ({ id, label }: RecordData) => {
    const labelString = label?.length ? `${label}, ` : '';
    const idString = `Record ID: ${id}`;

    return `${labelString}${idString}`;
  };

  return (
    <div data-testid='load' className="load">
      <strong><FormattedMessage id='marva.other-records' /></strong>
      <div className="button-group">
        {availableRecords?.map(({ id, label }: RecordData) => (
          <button key={id} onClick={() => fetchRecord(String(id))}>
            {generateButtonLabel({ id, label })}
          </button>
        )) || <div><FormattedMessage id='marva.no-records' /></div>}
      </div>
    </div>
  );
};
