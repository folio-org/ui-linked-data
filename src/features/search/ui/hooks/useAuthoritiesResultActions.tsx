import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Button, ButtonType } from '@/components/Button';
import { AuthRefType } from '@/common/constants/search.constants';
import type { Row } from '@/components/Table';

interface UseAuthoritiesResultActionsProps {
  context: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  onTitleClick?: (id: string, title?: string, headingType?: string) => void;
  checkFailedId?: (id: string) => boolean;
}

/**
 * Hook for applying context-specific actions to authorities result rows
 * Handles title formatting, assign buttons, and MARC preview links
 */
export const useAuthoritiesResultActions = ({
  context,
  onAssign,
  onTitleClick,
  checkFailedId = () => false,
}: UseAuthoritiesResultActionsProps) => {
  const { formatMessage } = useIntl();

  const applyActionFormatters = useCallback(
    (rows: SearchResultsTableRow[]): Row[] => {
      return rows.map(row => {
        const { __meta, title, subclass, authorized, authoritySource } = row;
        const isMissingMatchQuery = __meta.isAnchor && !(subclass.label && authorized.label && authoritySource.label);

        return {
          ...row,

          // Format title with click handler
          title: {
            ...row.title,
            children: isMissingMatchQuery ? (
              <div className="search-results-item-missing-match">
                {formatMessage(
                  { id: 'ld.searchQueryWouldBeHere' },
                  {
                    query: <span className="search-results-item-missing-match-query">{title.label}</span>,
                  },
                )}
              </div>
            ) : (
              <Button
                type={ButtonType.Link}
                className="search-results-item-title"
                onClick={() => onTitleClick?.(__meta.id, title.label as string, subclass.label as string)}
              >
                {__meta.isAnchor ? <strong>{title.label}</strong> : title.label}
              </Button>
            ),
          },

          // Add assign button for complex lookup context
          ...(context === 'complexLookup' && {
            assign: {
              children:
                authorized.label === AuthRefType.Authorized ? (
                  <Button
                    type={ButtonType.Primary}
                    onClick={() =>
                      onAssign?.({
                        id: __meta.id,
                        title: (title.label as string) || '',
                        linkedFieldValue: (subclass.label as string) || '',
                      })
                    }
                    data-testid={`assign-button-${__meta.id}`}
                    disabled={checkFailedId(__meta.id)}
                  >
                    {formatMessage({ id: 'ld.assign' })}
                  </Button>
                ) : undefined,
            },
          }),
        };
      });
    },
    [context, onAssign, onTitleClick, formatMessage, checkFailedId],
  );

  return { applyActionFormatters };
};
