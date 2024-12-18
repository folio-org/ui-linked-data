import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { type Row } from '@components/Table';
import { useSearchContext } from '@common/hooks/useSearchContext';
import { ComplexLookupSearchResultsProps } from '@components/ComplexLookupField/ComplexLookupSearchResults';
import { useSearchState } from '@src/store';
import { useComplexLookupValidation } from './useComplexLookupValidation';

export const useComplexLookupSearchResults = ({
  onTitleClick,
  tableConfig,
  searchResultsFormatter,
}: ComplexLookupSearchResultsProps) => {
  const { onAssignRecord } = useSearchContext();
  const { data, sourceData } = useSearchState();
  const { formatMessage } = useIntl();
  const { checkFailedId } = useComplexLookupValidation();

  const applyActionItems = useCallback(
    (rows: Row[]): Row[] =>
      rows?.map(row => {
        const formattedRow: Row = { ...row };

        Object.entries(tableConfig.columns).forEach(([key, column]) => {
          formattedRow[key] = {
            ...row[key],
            children: column.formatter
              ? column.formatter({
                  row,
                  formatMessage,
                  onAssign: onAssignRecord,
                  onTitleClick,
                  validateId: checkFailedId,
                })
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
