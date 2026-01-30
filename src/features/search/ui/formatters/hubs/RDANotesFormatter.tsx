import { FC } from 'react';

import { BaseNotesFormatter } from './BaseNotesFormatter';

interface RDANotesFormatterProps {
  row: SearchResultsTableRow;
}

export const RDANotesFormatter: FC<RDANotesFormatterProps> = ({ row }) => {
  return <BaseNotesFormatter row={row} fieldKey="rda" />;
};
