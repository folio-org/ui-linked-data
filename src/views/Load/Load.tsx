import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getAllRecords } from '@common/api/records.api';
import { generateEditResourceUrl } from '@common/helpers/navigation.helper';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import './Load.scss';

export const Load = () => {
  const [availableRecords, setAvailableRecords] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getAllRecords({
      pageNumber: 0,
      type: TYPE_URIS.INSTANCE, // TODO: pass URI of the selected level of abstraction (Work, Instance, Item))
    })
      .then(res => {
        setAvailableRecords(res?.content);
      })
      .catch(err => console.error('Error fetching resource descriptions: ', err));
  }, []);

  // TODO: Workaroud for demo; define type and format for data received from API
  const generateButtonLabel = ({ id, label }: RecordData) => {
    const labelString = label?.length ? `${label}, ` : '';
    const idString = `Resource description ID: ${id}`;

    return `${labelString}${idString}`;
  };

  return (
    <div data-testid="load" className="load">
      <strong>
        <FormattedMessage id="marva.other-available-rds" />
      </strong>
      <div className="button-group">
        {availableRecords?.map(({ id, label }: RecordData) => (
          <Link key={id} to={generateEditResourceUrl(id)} className="button">
            {generateButtonLabel({ id, label })}
          </Link>
        )) || (
          <div>
            <FormattedMessage id="marva.no-available-rds" />
          </div>
        )}
      </div>
    </div>
  );
};
