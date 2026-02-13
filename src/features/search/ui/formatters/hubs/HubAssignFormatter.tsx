import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, ButtonType } from '@/components/Button';

interface HubAssignFormatterProps {
  row: SearchResultsTableRow;
  onAssign: ({ id, title, uri }: ComplexLookupAssignRecordDTO, hasSimpleFlow?: boolean) => void;
}

export const HubAssignFormatter: FC<HubAssignFormatterProps> = ({ row, onAssign }) => {
  const { id, isLocal } = row.__meta;

  const handleButtonClick = () =>
    onAssign(
      {
        id,
        title: (row.hub.label as string) || '',
        uri: (row.hub.uri as string) || '',
        sourceType: isLocal ? 'local' : 'libraryOfCongress',
      },
      true,
    );

  const labelId = isLocal ? 'ld.assign' : 'ld.importAssign';

  return (
    <Button type={ButtonType.Primary} onClick={handleButtonClick} data-testid={`assign-button-${id}`}>
      <FormattedMessage id={labelId} />
    </Button>
  );
};
