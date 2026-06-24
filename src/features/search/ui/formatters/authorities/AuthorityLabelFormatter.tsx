import { FC } from 'react';

interface AuthorityLabelFormatterProps {
  row: SearchResultsTableRow;
  onTitleClick?: (id: string) => void;
}

export const AuthorityLabelFormatter: FC<AuthorityLabelFormatterProps> = ({ row }) => {
  const title = row.label?.label as string;

  if (!title) {
    return <span />;
  }

  return <span>{title}</span>;
};
