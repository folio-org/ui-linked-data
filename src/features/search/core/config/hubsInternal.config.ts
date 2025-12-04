import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import type { SearchTypeConfig } from '../types';
import { HubsExternalRequestBuilder } from '../strategies/requestBuilders';
import { ResourcesResponseTransformer } from '../strategies/responseTransformers';

/**
 * Hubs Internal Configuration (Atomic)
 *
 * Search in local hub registry.
 * Composite key: "hubs:internal"
 */
export const hubsInternalConfig: SearchTypeConfig = {
  id: 'hubs:internal',

  strategies: {
    // Uses same request builder as external for now
    // Can be replaced with HubsInternalRequestBuilder when implemented
    requestBuilder: new HubsExternalRequestBuilder(),
    responseTransformer: new ResourcesResponseTransformer(),
    resultFormatter: undefined,
  },

  searchBy: {
    searchableIndices: [
      { value: SearchableIndexEnum.HubNameLeftAnchored },
      { value: SearchableIndexEnum.HubNameKeyword },
    ],
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.HubNameLeftAnchored,
    query: '',
    limit: 100,
    offset: 0,
  },
};
