import { SearchParam } from '../../core';

export function buildSearchUrlParams(
  segment: string,
  query: string,
  searchBy: string,
  source: string | undefined,
): URLSearchParams {
  const params = new URLSearchParams();

  if (segment) {
    params.set(SearchParam.SEGMENT, segment);
  }

  if (query) {
    params.set(SearchParam.QUERY, query);
  }

  // Only include searchBy if it exists (for simple search)
  // Advanced search has query but no searchBy
  if (searchBy) {
    params.set(SearchParam.SEARCH_BY, searchBy);
  }

  if (source) {
    params.set(SearchParam.SOURCE, source);
  }

  return params;
}

interface SearchValues {
  segment: string | null | undefined;
  query: string | null | undefined;
  searchBy: string | null | undefined;
  source: string | null | undefined;
}

export function haveSearchValuesChanged(current: SearchValues, updated: SearchValues): boolean {
  // Normalize null to undefined for consistent comparison
  const normalizedCurrentSource = current.source ?? undefined;
  const normalizedUpdatedSource = updated.source ?? undefined;

  return (
    current.segment !== updated.segment ||
    current.query !== updated.query ||
    current.searchBy !== updated.searchBy ||
    normalizedCurrentSource !== normalizedUpdatedSource
  );
}
