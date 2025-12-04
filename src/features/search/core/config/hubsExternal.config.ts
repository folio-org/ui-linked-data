import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import type { SearchTypeConfig } from '../types';
import { HubsExternalRequestBuilder } from '../strategies/requestBuilders';
import { HubResponseTransformer } from '../strategies/responseTransformers';

/**
 * Hubs External Configuration (Atomic)
 *
 * Search in external hub services.
 * Composite key: "hubs:external"
 */
export const hubsExternalConfig: SearchTypeConfig = {
  id: 'hubs:external',

  strategies: {
    requestBuilder: new HubsExternalRequestBuilder(),
    responseTransformer: new HubResponseTransformer(),
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
