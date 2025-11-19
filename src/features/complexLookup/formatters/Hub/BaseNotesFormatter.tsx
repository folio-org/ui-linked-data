import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

interface BaseNotesFormatterProps {
  row: SearchResultsTableRow;
  fieldKey: 'auth' | 'rda';
}

export const BaseNotesFormatter: FC<BaseNotesFormatterProps> = ({ row, fieldKey }) => {
  const labelId = row[fieldKey]?.label as string;

  return labelId ? <FormattedMessage id={labelId} /> : '-';
};
