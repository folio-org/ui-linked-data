import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@components/Button';

interface HubAssignFormatterProps {
  row: SearchResultsTableRow;
  onAssign: ({ id, title }: ComplexLookupAssignRecordDTO) => void;
}

export const HubAssignFormatter: FC<HubAssignFormatterProps> = ({ row, onAssign }) => {
  return (
    <Button
      type={ButtonType.Primary}
      onClick={() =>
        onAssign({
          id: row.__meta.id,
          title: (row.hub.label as string) || '',
          uri: (row.hub.uri as string) || '',
        })
      }
      data-testid={`assign-button-${row.__meta.id}`}
    >
      <FormattedMessage id="ld.assign" />
    </Button>
  );
};
