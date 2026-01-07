export function enrichRowsWithLocalAvailability(
  data: SearchResultsTableRow[] | undefined,
  localHubIds: Set<string>,
): SearchResultsTableRow[] | undefined {
  if (!data) return undefined;

  return data.map(row => {
    const isLocalValue = localHubIds.has(row.__meta?.id || '');

    return {
      ...row,
      __meta: {
        ...row.__meta,
        isLocal: isLocalValue,
      },
    } as SearchResultsTableRow;
  });
}

export function buildHubLocalCheckQuery(tokens: string[]): string {
  const queryParts = tokens.map(token => `originalId="${token}"`);

  return queryParts.join(' or ');
}

export function extractOriginalIds(content?: Array<{ id?: string; originalId?: string }>): Set<string> {
  if (!content || content.length === 0) {
    return new Set<string>();
  }

  return new Set<string>(content.map(item => item.originalId).filter(Boolean) as string[]);
}
