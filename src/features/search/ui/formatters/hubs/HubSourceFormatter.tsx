import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

interface HubSourceFormatterProps {
  row: SearchResultsTableRow;
}

export const HubSourceFormatter: FC<HubSourceFormatterProps> = ({ row }) => {
  const source = row.source?.label as string | undefined;

  return (
    <span className="hub-source" data-testid={`hub-source-${row.__meta.id}`}>
      <FormattedMessage id={source || 'ld.source.libraryOfCongress'} />
    </span>
  );
};
