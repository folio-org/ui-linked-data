import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import { HUB_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import type { SearchTypeConfig } from '../types';
import { HubsLoCRequestBuilder } from '../strategies/requestBuilders';
import { ResourcesResponseTransformer } from '../strategies/responseTransformers';
import { HubsLookupResultFormatter } from '../strategies/resultFormatters';

/**
 * Hubs Local Configuration for Search page (Atomic)
 *
 * Search in local hub registry.
 * Composite key: "hubs:local"
 */
export const hubsLocalConfig: SearchTypeConfig = {
  id: 'hubs:local',

  strategies: {
    // Uses same request builder as external for now
    // Can be replaced with HubsInternalRequestBuilder when implemented
    requestBuilder: new HubsLoCRequestBuilder(HUB_SEARCHABLE_INDICES_MAP),
    responseTransformer: new ResourcesResponseTransformer(),
    resultFormatter: new HubsLookupResultFormatter(),
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
