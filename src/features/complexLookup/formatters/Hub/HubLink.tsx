import { FC } from 'react';

interface HubLinkFormatterProps {
  row: SearchResultsTableRow;
}

export const HubLinkFormatter: FC<HubLinkFormatterProps> = ({ row }) => {
  const hubTitle = row.hub?.label as string;
  const hubUri = row.hub?.uri as string;

  if (!hubTitle || !hubUri) {
    return <span>{hubTitle || ''}</span>;
  }

  return (
    <a
      href={hubUri}
      target="_blank"
      rel="noopener noreferrer"
      className="hub-link"
      data-testid={`hub-link-${row.__meta.id}`}
    >
      {hubTitle}
    </a>
  );
};
