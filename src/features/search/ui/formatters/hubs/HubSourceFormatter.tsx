import { FC } from 'react';

interface HubSourceFormatterProps {
  row: SearchResultsTableRow;
}

/**
 * Formatter for hub source column
 */
export const HubSourceFormatter: FC<HubSourceFormatterProps> = ({ row }) => {
  return (
    <span className="hub-source" data-testid={`hub-source-${row.__meta.id}`}>
      {row.source.label}
    </span>
  );
};
