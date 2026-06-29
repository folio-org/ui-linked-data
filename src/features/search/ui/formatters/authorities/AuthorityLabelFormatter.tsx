import { FC } from 'react';

import { Button, ButtonType } from '@/components/Button';

interface AuthorityLabelFormatterProps {
  row: SearchResultsTableRow;
  onTitleClick?: (id: string) => void;
}

export const AuthorityLabelFormatter: FC<AuthorityLabelFormatterProps> = ({ row, onTitleClick }) => {
  const title = row.label?.label as string;

  if (!title) {
    return <span />;
  }

  return (
    <Button
      type={ButtonType.Link}
      className="authority-link"
      onClick={() => onTitleClick?.(row.__meta.id)}
      data-testid={`authority-preview-link-${row.__meta.id}`}
    >
      {title}
    </Button>
  );
};
