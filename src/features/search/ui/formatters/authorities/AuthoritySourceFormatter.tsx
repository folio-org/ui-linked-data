import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

interface AuthoritySourceFormatterProps {
  row: SearchResultsTableRow;
}

/**
 * Renders the authority source column.
 * - LD authorities use a static, translatable source label (the cell holds the i18n id).
 * - MARC authorities use the already-mapped source-file name (plain text).
 */
export const AuthoritySourceFormatter: FC<AuthoritySourceFormatterProps> = ({ row }) => {
  const isLD = (row.__meta as Record<string, unknown>)?.isLD as boolean;
  const label = (row.source?.label as string) ?? '';

  if (!label) {
    return <span />;
  }

  return isLD ? <FormattedMessage id={label} /> : <span>{label}</span>;
};
