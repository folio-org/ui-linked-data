import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import { HUB_LOCAL_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import type { SearchTypeConfig } from '../types';
import { HubsInternalRequestBuilder } from '../strategies/requestBuilders';
import { ResourcesResponseTransformer } from '../strategies/responseTransformers';
import { HubsLocalResultFormatter } from '../strategies/resultFormatters';

/**
 * Hubs Local Configuration for Search page (Atomic)
 *
 * Search in local hub registry.
 * Composite key: "hubs:local"
 */
export const hubsLocalConfig: SearchTypeConfig = {
  id: 'hubs:local',

  strategies: {
    requestBuilder: new HubsInternalRequestBuilder(HUB_LOCAL_SEARCHABLE_INDICES_MAP),
    responseTransformer: new ResourcesResponseTransformer(),
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
