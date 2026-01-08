import { SEARCH_CHECK_QUERY_PARAM, SEARCH_OPERATOR } from '@/common/constants/search.constants';

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
  const queryParts = tokens.map(token => `${SEARCH_CHECK_QUERY_PARAM.ORIGINAL_ID}="${token}"`);

  return queryParts.join(` ${SEARCH_OPERATOR.OR} `);
}

export function extractOriginalIds(content?: Array<{ id?: string; originalId?: string }>): Set<string> {
  if (!content || content.length === 0) {
    return new Set<string>();
  }

  return new Set<string>(content.map(({ originalId }) => originalId).filter(Boolean) as string[]);
}
