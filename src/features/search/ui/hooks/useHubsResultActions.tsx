import { useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button, ButtonType } from '@/components/Button';
import type { Row } from '@/components/Table';

interface UseHubsResultActionsProps {
  context: 'search' | 'complexLookup';
  onAssign?: (data: ComplexLookupAssignRecordDTO) => void;
  checkFailedId?: (id: string) => boolean;
}

/**
 * Hook for applying context-specific actions to hubs result rows
 * Handles external links, assign buttons, and auth/RDA indicator formatting
 */
export const useHubsResultActions = ({ context, onAssign, checkFailedId = () => false }: UseHubsResultActionsProps) => {
  const { formatMessage } = useIntl();

  const applyActionFormatters = useCallback(
    (rows: SearchResultsTableRow[]): Row[] => {
      return rows.map(row => {
        const { __meta, hub, auth, rda } = row;
        const hubTitle = hub?.label as string;
        const hubUri = hub?.uri as string;

        return {
          ...row,

          // Format hub as external link
          hub: {
            ...row.hub,
            children:
              hubTitle && hubUri ? (
                <a
                  href={hubUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hub-link"
                  data-testid={`hub-link-${__meta.id}`}
                >
                  {hubTitle}
                </a>
              ) : (
                <span>{hubTitle || ''}</span>
              ),
          },

          // Format auth/rda columns with translations
          auth: {
            ...row.auth,
            children: auth.label ? <FormattedMessage id={auth.label as string} /> : undefined,
          },
          rda: {
            ...row.rda,
            children: rda.label ? <FormattedMessage id={rda.label as string} /> : undefined,
          },

          // Add assign button for complex lookup context
          ...(context === 'complexLookup' && {
            assign: {
              children: (
                <Button
                  type={ButtonType.Primary}
                  onClick={() =>
                    onAssign?.({
                      id: __meta.id,
                      title: hubTitle || '',
                      linkedFieldValue: '',
                      uri: hubUri,
                    })
                  }
                  data-testid={`assign-button-${__meta.id}`}
                  disabled={checkFailedId(__meta.id)}
                >
                  {formatMessage({ id: 'ld.assign' })}
                </Button>
              ),
            },
          }),
        };
      });
    },
    [context, onAssign, formatMessage, checkFailedId],
  );

  return { applyActionFormatters };
};
