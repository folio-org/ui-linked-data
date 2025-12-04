import type { IntlShape } from 'react-intl';
import type { SearchTypeConfig } from '../../core/types';
import type { SearchTypeUIConfig } from '../types';

interface GetPlaceholderParams {
  searchBy: string | undefined;
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  formatMessage: IntlShape['formatMessage'];
}

export function getSearchPlaceholder({
  searchBy,
  config,
  uiConfig,
  formatMessage,
}: GetPlaceholderParams): string | undefined {
  if (!uiConfig.searchableIndices?.length) {
    // No searchable indices defined, use generic placeholder
    const placeholderId = uiConfig.ui?.placeholderId;

    return placeholderId ? formatMessage({ id: placeholderId }) : undefined;
  }

  // Determine effective searchBy: use store value if valid, otherwise config default
  const effectiveSearchBy = searchBy || config.defaults?.searchBy;

  // Try to find the index config for the effective searchBy
  if (effectiveSearchBy) {
    const indexConfig = uiConfig.searchableIndices.find(idx => idx.value === effectiveSearchBy);

    if (indexConfig) {
      if (indexConfig.placeholder) {
        return formatMessage({ id: indexConfig.placeholder });
      }

      // Index exists but has no placeholder defined - return generic or undefined
      const placeholderId = uiConfig.ui?.placeholderId;

      return placeholderId ? formatMessage({ id: placeholderId }) : undefined;
    }
  }

  // Use first index's placeholder as fallback for initial render
  const firstIndex = uiConfig.searchableIndices[0];

  if (firstIndex?.placeholder) {
    return formatMessage({ id: firstIndex.placeholder });
  }

  // Fall back to generic placeholder
  const placeholderId = uiConfig.ui?.placeholderId;

  return placeholderId ? formatMessage({ id: placeholderId }) : undefined;
}
