import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';

import { HUB_LOCAL_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';

import { HubsLocalRequestBuilder } from '../strategies/requestBuilders';
import { HubLocalResponseTransformer } from '../strategies/responseTransformers';
import { HubsLocalResultFormatter } from '../strategies/resultFormatters';
import type { SearchTypeConfig } from '../types';

/**
 * Hubs Local Configuration for Search page (Atomic)
 *
 * Search in local hub registry.
 * Composite key: "hubs:local"
 */
export const hubsLocalConfig: SearchTypeConfig = {
  id: 'hubs:local',

  strategies: {
    requestBuilder: new HubsLocalRequestBuilder(HUB_LOCAL_SEARCHABLE_INDICES_MAP),
    responseTransformer: new HubLocalResponseTransformer(),
    resultFormatter: new HubsLocalResultFormatter(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.HubNameKeyword,
    query: '',
    limit: 100, // API fetches 100 results
    offset: 0,
  },
};
