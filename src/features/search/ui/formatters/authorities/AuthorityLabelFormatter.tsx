import { FC } from 'react';

import { Button, ButtonType } from '@/components/Button';

interface AuthorityLabelFormatterProps {
  row: SearchResultsTableRow;
  onTitleClick?: (id: string) => void;
}

export const AuthorityLabelFormatter: FC<AuthorityLabelFormatterProps> = ({ row }) => {
  const title = row.label?.label as string;

  // TODO: add event handler to display preview
  const onTitleClick = () => {};

  if (!title) {
    return <span />;
  }

  return (
    <Button
      type={ButtonType.Link}
      className="authority-link"
      onClick={onTitleClick}
      data-testid={`authority-preview-link-${row.__meta.id}`}
    >
      {title}
    </Button>
  );
};
