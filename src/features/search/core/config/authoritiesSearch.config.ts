import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';

import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';

import { AuthoritiesSearchRequestBuilder } from '../strategies/requestBuilders';
import { AuthoritiesSearchResponseTransformer } from '../strategies/responseTransformers';
import { AuthoritiesResultFormatter } from '../strategies/resultFormatters';
import type { SearchTypeConfig } from '../types';

/**
 * Authorities Search Configuration (Atomic)
 *
 * Standard keyword-based search for authorities.
 * Composite key: "authorities:search"
 */
export const authoritiesSearchConfig: SearchTypeConfig = {
  id: 'authorities:search',

  strategies: {
    requestBuilder: new AuthoritiesSearchRequestBuilder(COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP),
    responseTransformer: new AuthoritiesSearchResponseTransformer(),
    resultFormatter: new AuthoritiesResultFormatter(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.Keyword,
    query: '',
    limit: 100, // API fetches 100 results
    offset: 0,
  },
};
