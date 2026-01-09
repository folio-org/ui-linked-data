import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

interface HubSourceFormatterProps {
  row: SearchResultsTableRow;
}

/**
 * Formatter for hub source column
 */
export const HubSourceFormatter: FC<HubSourceFormatterProps> = ({ row }) => {
  const { label } = row.source;

  return (
    <span className="hub-source" data-testid={`hub-source-${row.__meta.id}`}>
      {typeof label === 'string' ? <FormattedMessage id={label} /> : label}
    </span>
  );
};
