import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import type { SearchTypeConfig } from '../types';
import { AuthoritiesBrowseRequestBuilder } from '../strategies/requestBuilders';
import { AuthoritiesBrowseResponseTransformer } from '../strategies/responseTransformers';

/**
 * Authorities Browse Configuration (Atomic)
 *
 * Alphabetical browsing by name/title for authorities.
 * Composite key: "authorities:browse"
 */
export const authoritiesBrowseConfig: SearchTypeConfig = {
  id: 'authorities:browse',

  strategies: {
    requestBuilder: new AuthoritiesBrowseRequestBuilder(COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP),
    responseTransformer: new AuthoritiesBrowseResponseTransformer(),
    resultFormatter: undefined,
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.PersonalName,
    query: '',
    limit: 100,
    offset: 0,
  },
};
