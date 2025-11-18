import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { type Row } from '@components/Table';
import { useSearchContext } from '@/features/search';
import { useSearchState } from '@src/store';
import { ComplexLookupSearchResultsProps } from '../components/ComplexLookupSearchResults/ComplexLookupSearchResults';
import { useComplexLookupValidation } from './useComplexLookupValidation';

export const useComplexLookupSearchResults = ({
  onTitleClick,
  tableConfig,
  searchResultsFormatter,
}: ComplexLookupSearchResultsProps) => {
  const { onAssignRecord } = useSearchContext();
  const { data, sourceData } = useSearchState(['data', 'sourceData']);
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
                  checkFailedId,
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
        const { label, position, className, minWidth, maxWidth } = (tableConfig.columns[key] ||
          {}) as SearchResultsTableColumn;

        accum[key] = {
          label: label ? formatMessage({ id: label }) : '',
          position: position,
          className: className,
          minWidth,
          maxWidth,
        };

        return accum;
      }, {} as Row),
    [tableConfig],
  );

  return { formattedData, listHeader };
};
