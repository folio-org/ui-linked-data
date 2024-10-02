import { FC, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage, useIntl } from 'react-intl';
import { Row, Table } from '@components/Table';
import state from '@state';

type ComplexLookupSearchResultsProps = {
  onAssign: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
  tableConfig: SearchResultsTableConfig;
  searchResultsFormatter: (data: any[]) => Row[];
};

export const ComplexLookupSearchResults: FC<ComplexLookupSearchResultsProps> = ({
  onAssign,
  tableConfig,
  searchResultsFormatter,
}) => {
  const data = useRecoilValue(state.search.data);
  const { formatMessage } = useIntl();

  const applyActionItems = useCallback(
    (rows: Row[]): Row[] =>
      rows.map(row => {
        const formattedRow: Row = { ...row };

        Object.entries(tableConfig.columns).forEach(([key, column]) => {
          formattedRow[key] = {
            ...row[key],
            children: column.formatter ? column.formatter(row, formatMessage, onAssign) : row[key].label,
          };
        });

        return formattedRow;
      }),
    [onAssign, tableConfig],
  );

  const formattedData = useMemo(() => applyActionItems(searchResultsFormatter(data || [])), [applyActionItems, data]);

  const listHeader = useMemo(
    () =>
      Object.keys(tableConfig.columns).reduce((accum, key) => {
        const { label, position, className } = (tableConfig.columns[key] || {}) as SearchResultsTableColumn;

        accum[key] = {
          label: label ? <FormattedMessage id={label} /> : '',
          position: position,
          className: className,
        };

        return accum;
      }, {} as Row),
    [tableConfig],
  );

  return (
    <div className="search-result-list">
      <Table header={listHeader} data={formattedData} className="results-list" />
    </div>
  );
};
