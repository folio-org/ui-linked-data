import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, ButtonType } from '@/components/Button';

interface HubActionFormatterProps {
  row: SearchResultsTableRow;
  onEdit?: (id: string) => void;
  onImport?: (id: string, uri: string) => void;
}

export const HubActionFormatter: FC<HubActionFormatterProps> = ({ row, onEdit, onImport }) => {
  const isLocal = (row.__meta as Record<string, unknown>)?.isLocal as boolean;
  const hubId = row.__meta.id;
  const hubUri = row.hub?.uri as string;

  if (isLocal) {
    return (
      <Button
        type={ButtonType.Primary}
        onClick={() => onEdit?.(hubId)}
        data-testid={`hub-edit-${hubId}`}
        className="hub-action-button"
      >
        <FormattedMessage id="ld.edit" />
      </Button>
    );
  }

  return (
    <Button
      type={ButtonType.Primary}
      onClick={() => onImport?.(hubId, hubUri)}
      data-testid={`hub-import-${hubId}`}
      className="hub-action-button"
    >
      <FormattedMessage id="ld.import.edit" />
    </Button>
  );
};
