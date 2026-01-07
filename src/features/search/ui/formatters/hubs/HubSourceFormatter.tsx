import { FC } from 'react';
import { useIntl } from 'react-intl';
import { getHubSources, formatSourceList } from '../../utils/hubSources.util';

interface HubSourceFormatterProps {
  row: SearchResultsTableRow;
}

/**
 * Formatter for hub source column
 */
export const HubSourceFormatter: FC<HubSourceFormatterProps> = ({ row }) => {
  const { formatMessage } = useIntl();

  // Get all applicable source keys for this hub
  const sourceKeys = getHubSources(row);

  // Localize each source key
  const localizedSources = sourceKeys.map(key => formatMessage({ id: key }));

  // Format into a single string (handles single or multiple sources)
  const text = formatSourceList(localizedSources, formatMessage);

  return (
    <span className="hub-source" data-testid={`hub-source-${row.__meta.id}`}>
      {text}
    </span>
  );
};
