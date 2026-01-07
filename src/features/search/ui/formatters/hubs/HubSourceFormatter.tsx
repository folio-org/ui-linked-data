import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

interface HubSourceFormatterProps {
  row: SearchResultsTableRow;
}

export const HubSourceFormatter: FC<HubSourceFormatterProps> = ({ row }) => {
  const isLocal = row.__meta?.isLocal === true;
  const sourceKey = isLocal ? 'ld.source.libraryOfCongressLocal' : 'ld.source.libraryOfCongress';

  return (
    <span className="hub-source" data-testid={`hub-source-${row.__meta.id}`}>
      <FormattedMessage id={sourceKey} />
    </span>
  );
};
