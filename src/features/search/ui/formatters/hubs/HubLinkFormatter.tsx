import { FC } from 'react';

import { Button, ButtonType } from '@/components/Button';

import './HubLinkFormatter.scss';

interface HubLinkFormatterProps {
  row: SearchResultsTableRow;
  onTitleClick?: (id: string, title: string) => void;
}

export const HubLinkFormatter: FC<HubLinkFormatterProps> = ({ row, onTitleClick }) => {
  const hubTitle = row.hub?.label as string;
  const hubUri = row.hub?.uri as string;
  const isLocal = (row.__meta as Record<string, unknown>)?.isLocal as boolean;

  if (!hubTitle) {
    return <span />;
  }

  // Local hubs: render as a clickable button that opens a preview
  if (isLocal && onTitleClick) {
    return (
      <Button
        type={ButtonType.Link}
        className="hub-link"
        onClick={() => onTitleClick(row.__meta.id, hubTitle)}
        data-testid={`hub-preview-link-${row.__meta.id}`}
      >
        {hubTitle}
      </Button>
    );
  }

  if (!hubUri) {
    return <span>{hubTitle}</span>;
  }

  // External hubs: link to LoC URI
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
