import { SEARCH_CHECK_QUERY_PARAM, SEARCH_OPERATOR } from '@/common/constants/search.constants';

export function buildHubLocalCheckQuery(tokens: string[]): string {
  const queryParts = tokens.map(token => `${SEARCH_CHECK_QUERY_PARAM.ORIGINAL_ID}="${token}"`);

  return queryParts.join(` ${SEARCH_OPERATOR.OR} `);
}

export function extractOriginalIds(content?: Array<{ id?: string; originalId?: string }>): Map<string, string> {
  if (!content || content.length === 0) {
    return new Map<string, string>();
  }

  const idMap = new Map<string, string>();

  content.forEach(({ id, originalId }) => {
    if (originalId && id) {
      idMap.set(originalId, id);
    }
  });

  return idMap;
}

export function getIsLocalFlag(hubEntry: HubSearchResultDTO): boolean {
  return 'isLocal' in hubEntry ? (hubEntry as HubSearchResultDTO & { isLocal: boolean }).isLocal : false;
}

export function getSourceLabel(isLocal: boolean): string {
  return isLocal ? 'ld.source.libraryOfCongress.local' : 'ld.source.libraryOfCongress';
}
