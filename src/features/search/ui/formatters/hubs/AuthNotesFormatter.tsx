import { FC } from 'react';

import { BaseNotesFormatter } from './BaseNotesFormatter';

interface AuthNotesFormatterProps {
  row: SearchResultsTableRow;
}

export const AuthNotesFormatter: FC<AuthNotesFormatterProps> = ({ row }) => {
  return <BaseNotesFormatter row={row} fieldKey="auth" />;
};
