import { FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@/components/Button';

export const TitleFormatter = ({
  row,
  onTitleClick,
}: {
  row: SearchResultsTableRow;
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
}) => {
  const { __meta, title, subclass, authorized, authoritySource } = row;
  const handleClick = () => {
    onTitleClick?.(__meta.id, title.label as string, subclass.label as string);
  };
  const isMissingMatchQuery = __meta.isAnchor && !(subclass.label && authorized.label && authoritySource.label);

  return isMissingMatchQuery ? (
    <div className="search-results-item-missing-match">
      <FormattedMessage
        id="ld.searchQueryWouldBeHere"
        values={{
          query: <span className="search-results-item-missing-match-query">{row.title.label}</span>,
        }}
      />
    </div>
  ) : (
    <Button type={ButtonType.Link} className="search-results-item-title" onClick={handleClick}>
      {__meta.isAnchor ? <strong>{row.title.label}</strong> : row.title.label}
    </Button>
  );
};
