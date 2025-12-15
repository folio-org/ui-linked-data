import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { type Row } from '@/components/Table';
import { FullDisplayType } from '@/common/constants/uiElements.constants';

interface UseTableFormatterProps {
  data: SearchResultsTableRow[];
  tableConfig: SearchResultsTableConfig;
  context: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
  checkFailedId?: (id: string) => boolean;
  // Instance-specific props
  onPreview?: (id: string) => Promise<void>;
  onEdit?: (url: string) => void;
  onToggleSelect?: (id: string, checked: boolean) => void;
  selectedInstances?: string[];
  previewContent?: Array<{ id: string }>;
  fullDisplayComponentType?: FullDisplayType;
}

/**
 * Hook for applying table config formatters to search result rows
 * Converts SearchResultsTableRow[] to Row[] with formatted children
 * Also generates list header from table config
 */
export const useTableFormatter = ({
  data,
  tableConfig,
  context,
  onAssign,
  onTitleClick,
  checkFailedId = () => false,
  onPreview,
  onEdit,
  onToggleSelect,
  selectedInstances = [],
  previewContent = [],
  fullDisplayComponentType,
}: UseTableFormatterProps) => {
  const { formatMessage } = useIntl();

  const applyFormatters = useCallback(
    (rows: SearchResultsTableRow[]): Row[] =>
      rows?.map(row => {
        const formattedRow: Row = { ...row };

        Object.entries(tableConfig.columns).forEach(([key, column]) => {
          // Skip assign column if context is search (not complexLookup)
          if (key === 'assign' && context === 'search') {
            return;
          }

          formattedRow[key] = {
            ...row[key],
            children: column.formatter
              ? column.formatter({
                  row,
                  formatMessage,
                  onAssign,
                  onTitleClick,
                  checkFailedId,
                  onPreview,
                  onEdit,
                  onToggleSelect,
                  selectedInstances,
                  previewContent,
                  fullDisplayComponentType,
                })
              : row[key]?.label,
          };
        });

        return formattedRow;
      }),
    [
      tableConfig,
      context,
      onAssign,
      onTitleClick,
      checkFailedId,
      formatMessage,
      onPreview,
      onEdit,
      onToggleSelect,
      selectedInstances,
      previewContent,
      fullDisplayComponentType,
    ],
  );

  const formattedData = useMemo(() => applyFormatters(data || []), [applyFormatters, data]);

  const listHeader = useMemo(
    () =>
      Object.keys(tableConfig.columns).reduce((accum, key) => {
        // Skip assign column if context is search (not complexLookup)
        if (key === 'assign' && context === 'search') {
          return accum;
        }

        const { label, position, className, minWidth, maxWidth } = (tableConfig.columns[key] ||
          {}) as SearchResultsTableColumn;

        // Adjust positions when assign column is skipped
        const adjustedPosition = key === 'assign' || context === 'complexLookup' ? position : position - 1;

        accum[key] = {
          label: label ? formatMessage({ id: label }) : '',
          position: adjustedPosition,
          className: className,
          minWidth,
          maxWidth,
        };

        return accum;
      }, {} as Row),
    [tableConfig, context, formatMessage],
  );

  return { formattedData, listHeader };
};
