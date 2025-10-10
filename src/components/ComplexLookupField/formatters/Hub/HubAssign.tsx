import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';

interface HubAssignFormatterProps {
  row: SearchResultsTableRow;
  onAssign: ({ id, title, uri }: ComplexLookupAssignRecordDTO, hasSimpleFlow?: boolean) => void;
}

export const HubAssignFormatter: FC<HubAssignFormatterProps> = ({ row, onAssign }) => {
  const handleButtonClick = () =>
    onAssign(
      {
        id: row.__meta.id,
        title: (row.hub.label as string) || '',
        uri: (row.hub.uri as string) || '',
      },
      true,
    );

  return (
    <Button type={ButtonType.Primary} onClick={handleButtonClick} data-testid={`assign-button-${row.__meta.id}`}>
      <FormattedMessage id="ld.assign" />
    </Button>
  );
};
