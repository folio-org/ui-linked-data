import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, ButtonType } from '@/components/Button';

interface AuthorityActionFormatterProps {
  row: SearchResultsTableRow;
  onEdit?: (id: string) => void;
  onImport?: (id: string) => void;
}

export const AuthorityActionFormatter: FC<AuthorityActionFormatterProps> = ({ row, onEdit, onImport }) => {
  const isLD = (row.__meta as Record<string, unknown>)?.isLD as boolean;
  const id = row.__meta.id;

  if (isLD) {
    return (
      <Button
        type={ButtonType.Primary}
        onClick={() => onEdit?.(id)}
        data-testid={`authority-edit-${id}`}
        className="authority-action-button"
      >
        <FormattedMessage id="ld.edit" />
      </Button>
    );
  }

  return (
    <Button
      type={ButtonType.Primary}
      onClick={() => onImport?.(id)}
      data-testid={`authority-import-${id}`}
      className="authority-action-button"
    >
      <FormattedMessage id="ld.import.edit" />
    </Button>
  );
};
