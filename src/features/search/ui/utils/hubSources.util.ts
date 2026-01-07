import { IntlShape } from 'react-intl';

export function getHubSources(row: SearchResultsTableRow): string[] {
  const sources: string[] = [];

  const primarySource = row.source?.label as string | undefined;

  if (primarySource) {
    sources.push(primarySource);
  } else {
    // Default to Library of Congress if no source specified
    sources.push('ld.source.libraryOfCongress');
  }

  // Add local source if hub exists locally
  if (row.__meta?.isLocal === true) {
    sources.push('ld.source.local');
  }

  return sources;
}

export function formatSourceList(sources: string[], formatMessage: IntlShape['formatMessage']): string {
  if (sources.length === 0) return '';
  if (sources.length === 1) return sources[0];

  return formatMessage(
    { id: 'ld.source.multiple' },
    {
      primary: sources[0],
      additional: sources.slice(1).join(', '),
    },
  );
}
