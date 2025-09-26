import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

interface RDANotesFormatterProps {
  row: SearchResultsTableRow;
}

export const RDANotesFormatter: FC<RDANotesFormatterProps> = ({ row }) => {
  const rdaLabelId = row.rda?.label as string;

  return rdaLabelId ? <FormattedMessage id={rdaLabelId} /> : null;
};
