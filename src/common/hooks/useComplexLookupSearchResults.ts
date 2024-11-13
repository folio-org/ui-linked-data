import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useIntl } from 'react-intl';
import { type Row } from '@components/Table';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { ComplexLookupSearchResultsProps } from '@components/ComplexLookupField/ComplexLookupSearchResults';
import state from '@state';

export const useComplexLookupSearchResults = ({
  onTitleClick,
  tableConfig,
  searchResultsFormatter,
}: ComplexLookupSearchResultsProps) => {
  const { onAssignRecord } = useSearchContext();
  const data = useRecoilValue(state.search.data);
  const sourceData = useRecoilValue(state.search.sourceData);
  const { formatMessage } = useIntl();

  const applyActionItems = useCallback(
    (rows: Row[]): Row[] =>
      rows?.map(row => {
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
          label: label ? formatMessage({ id: label }) : '',
          position: position,
          className: className,
        };

        return accum;
      }, {} as Row),
    [tableConfig],
  );

  return { formattedData, listHeader };
};
