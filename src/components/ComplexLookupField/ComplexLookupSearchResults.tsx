import { FC, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { FormattedMessage, useIntl } from 'react-intl';
import { Row, Table } from '@components/Table';
import { useSearchContext } from '@common/hooks/useSearchContext';
import state from '@state';

type ComplexLookupSearchResultsProps = {
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
  tableConfig: SearchResultsTableConfig;
  searchResultsFormatter: (data: any[], sourceData?: SourceDataDTO) => Row[];
};

export const ComplexLookupSearchResults: FC<ComplexLookupSearchResultsProps> = ({
  onTitleClick,
  tableConfig,
  searchResultsFormatter,
}) => {
  const { onAssignRecord } = useSearchContext();
  const data = useRecoilValue(state.search.data);
  const sourceData = useRecoilValue(state.search.sourceData);
  const { formatMessage } = useIntl();

  const applyActionItems = useCallback(
    (rows: Row[]): Row[] =>
      rows.map(row => {
        const formattedRow: Row = { ...row };

        Object.entries(tableConfig.columns).forEach(([key, column]) => {
          formattedRow[key] = {
            ...row[key],
            children: column.formatter
              ? column.formatter({ row, formatMessage, onAssign: onAssignRecord, onTitleClick })
              : row[key].label,
          };
        });

        return formattedRow;
      }),
    [onAssignRecord, tableConfig],
  );

  const formattedData = useMemo(
    () => applyActionItems(searchResultsFormatter(data || [], sourceData || [])),
    [applyActionItems, data],
  );

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
