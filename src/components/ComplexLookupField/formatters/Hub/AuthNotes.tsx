import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

interface AuthFormatterFormatterProps {
  row: SearchResultsTableRow;
}

export const AuthNotesFormatter: FC<AuthFormatterFormatterProps> = ({ row }) => {
  const authLabelId = row.rda?.label as string;

  return authLabelId ? <FormattedMessage id={authLabelId} /> : '-';
};
