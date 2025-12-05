import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import type { SearchTypeConfig } from '../types';
import { AuthoritiesSearchRequestBuilder } from '../strategies/requestBuilders';
import { AuthoritiesSearchResponseTransformer } from '../strategies/responseTransformers';

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
    resultFormatter: undefined,
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.Keyword,
    query: '',
    limit: 100,
    offset: 0,
  },
};
