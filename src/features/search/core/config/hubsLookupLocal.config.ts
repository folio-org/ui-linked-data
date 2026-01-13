import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import { HUB_LOCAL_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import type { SearchTypeConfig } from '../types';
import { HubsInternalRequestBuilder } from '../strategies/requestBuilders';
import { ResourcesResponseTransformer } from '../strategies/responseTransformers';
import { HubsLocalResultFormatter } from '../strategies/resultFormatters';

/**
 * Hubs Local Configuration for Complex lookups (Atomic)
 *
 * Search in local hub registry.
 * Composite key: "hubsLookup:local"
 */
export const hubsLookupLocalConfig: SearchTypeConfig = {
  id: 'hubsLookup:local',

  strategies: {
    // Uses same request builder as external for now
    // Can be replaced with HubsInternalRequestBuilder when implemented
    requestBuilder: new HubsInternalRequestBuilder(HUB_LOCAL_SEARCHABLE_INDICES_MAP),
    responseTransformer: new ResourcesResponseTransformer(),
    resultFormatter: new HubsLocalResultFormatter(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.HubNameLeftAnchored,
    query: '',
    limit: 100, // API fetches 100 results
    offset: 0,
  },
};
