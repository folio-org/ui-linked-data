import { IntlShape } from 'react-intl';

import { PROPERTIES_FROM_FOLIO } from '@/common/constants/bibframe.constants';
import { SearchIdentifiers } from '@/common/constants/search.constants';
import { SearchableIndex } from '@/common/constants/searchableIndex.constants';
import type { SelectValue } from '@/components/Select';

import { SearchTypeConfig } from '../../core';
import { SearchTypeUIConfig } from '../types';

type SearchOption = SearchIdentifiers | SelectValue | ComplexLookupSearchByValue[number];

interface GetPlaceholderParams {
  searchBy: string | undefined;
  config: SearchTypeConfig;
  uiConfig: SearchTypeUIConfig;
  formatMessage: IntlShape['formatMessage'];
}

export const getSearchPlaceholderLegacy = (
  selectOptions?: SearchOption[],
  searchBy?: SearchIdentifiers | SearchableIndex,
) => {
  if (!selectOptions || !Array.isArray(selectOptions)) {
    return '';
  }

  const currentOption = searchBy
    ? selectOptions.find(option => {
        if (typeof option === 'object' && 'value' in option) {
          return option.value === searchBy;
        }

        return option === searchBy;
      })
    : selectOptions[0];

  if (typeof currentOption === 'object' && currentOption && 'placeholder' in currentOption) {
    return currentOption.placeholder || '';
  }

  return '';
};

export const getPlaceholderForProperty = (uri?: string) => {
  let placeholder;

  for (const property of PROPERTIES_FROM_FOLIO) {
    if (uri === property) {
      placeholder = 'ld.placeholder.processing';
    }
  }

  return placeholder;
};

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
