import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import type { SearchTypeConfig } from '../../core/types';
import type { SearchTypeUIConfig } from '../types';

/**
 * Validates if a searchBy value is valid for the given configs.
 * Returns the validated searchBy or the core config's default if invalid.
 */
export function getValidSearchBy(
  searchBy: string | undefined,
  uiConfig: SearchTypeUIConfig,
  coreConfig?: SearchTypeConfig,
): string {
  const validIndices = uiConfig.searchableIndices?.map(({ value }) => value) ?? [];
  const defaultSearchBy = coreConfig?.defaults?.searchBy ?? DEFAULT_SEARCH_BY;

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
