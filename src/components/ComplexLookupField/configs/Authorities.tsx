import { FormattedMessage } from 'react-intl';
import { AuthRefType } from '@common/constants/search.constants';
import { Button, ButtonType } from '@components/Button';

export const authoritiesTableConfig: SearchResultsTableConfig = {
  columns: {
    assign: {
      label: '',
      position: 0,
      className: 'cell-fixed cell-fixed-100',
      formatter: ({
        row,
        onAssign,
      }: {
        row: SearchResultsTableRow;
        onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
      }) => {
        const isAuthorized = row.authorized.label === AuthRefType.Authorized;

        return isAuthorized ? (
          <Button
            type={ButtonType.Primary}
            onClick={() =>
              onAssign({
                id: row.__meta.id,
                title: (row.title.label as string) || '',
                linkedFieldValue: (row.subclass.label as string) || '',
              })
            }
            data-testid={`assign-button-${row.__meta.id}`}
          >
            <FormattedMessage id="ld.assign" />
          </Button>
        ) : null;
      },
    },
    authorized: {
      label: 'ld.authorizedReference',
      position: 1,
      className: 'cell-fixed cell-fixed-170',
      formatter: ({ row }: { row: SearchResultsTableRow }) => {
        const isAuthorized = row.authorized.label === AuthRefType.Authorized;
        const { label } = row.authorized;

        return isAuthorized ? <b>{label}</b> : <span>{label}</span>;
      },
    },
    title: {
      label: 'ld.headingReference',
      position: 1,
      className: 'cell-fixed cell-fixed-370',
      formatter: ({
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
      },
    },
    subclass: {
      label: 'ld.typeOfHeading',
      position: 2,
      className: 'cell-fixed cell-fixed-140',
    },
    authoritySource: {
      label: 'ld.authoritySource',
      position: 3,
      className: 'cell-fixed cell-fixed-250',
    },
  },
};
