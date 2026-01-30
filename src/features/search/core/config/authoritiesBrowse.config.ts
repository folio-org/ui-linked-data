import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';

import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';

import { AuthoritiesBrowseRequestBuilder } from '../strategies/requestBuilders';
import { AuthoritiesBrowseResponseTransformer } from '../strategies/responseTransformers';
import { AuthoritiesResultFormatter } from '../strategies/resultFormatters';
import type { SearchTypeConfig } from '../types';

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
    resultFormatter: new AuthoritiesResultFormatter(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.PersonalName,
    query: '',
    limit: 100, // API fetches 100 results
    offset: 0,
  },
};
