import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import type { SearchTypeConfig } from '../../core/types';

/**
 * Validates if a searchBy value is valid for the given config.
 * Returns the validated searchBy or the config's default if invalid.
 */
export function getValidSearchBy(searchBy: string | undefined, config: SearchTypeConfig): string {
  const validIndices = config.searchBy?.searchableIndices?.map(({ value }) => value) ?? [];
  const defaultSearchBy = config.defaults?.searchBy ?? DEFAULT_SEARCH_BY;

  if (!searchBy) {
    return defaultSearchBy;
  }

  if (validIndices.length === 0) {
    return searchBy;
  }

  if (validIndices.includes(searchBy)) {
    return searchBy;
  }

  return defaultSearchBy;
}
