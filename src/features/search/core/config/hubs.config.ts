import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import type { DataCapabilities, SearchableIndex, SearchTypeConfig } from '../types';
import { HubsExternalRequestBuilder } from '../strategies/requestBuilders';
import { ResourcesResponseTransformer, HubResponseTransformer } from '../strategies/responseTransformers';

/**
 * Hubs Search Type Configuration
 *
 * Supports two sources:
 * - internal: Local hub registry
 * - external: External hub services
 */
export const hubsConfig: SearchTypeConfig = {
  id: 'hubs',

  // Base strategies for all hub searches
  strategies: {
    requestBuilder: new HubsExternalRequestBuilder(),
    responseTransformer: new ResourcesResponseTransformer(),
    resultFormatter: undefined,
  },

  searchBy: {
    searchableIndices: [
      { value: SearchableIndexEnum.HubNameLeftAnchored },
      { value: SearchableIndexEnum.HubNameKeyword },
    ] as SearchableIndex[],
  },

  capabilities: {} as DataCapabilities,

  // Sources with strategy overrides
  sources: {
    internal: {
      id: 'internal',
      capabilities: {} as DataCapabilities,
    },
    external: {
      id: 'external',
      // Override strategies for external API
      strategies: {
        requestBuilder: new HubsExternalRequestBuilder(),
        responseTransformer: new HubResponseTransformer(),
      },
      capabilities: {} as DataCapabilities,
    },
  },

  // Default values
  defaults: {},
};
