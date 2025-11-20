import type {
  DataCapabilities,
  RequestBuilder,
  ResponseTransformer,
  ResultFormatter,
  SearchableIndex,
  SearchTypeConfig,
} from '../types';

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
    requestBuilder: {} as RequestBuilder,
    responseTransformer: {} as ResponseTransformer,
    resultFormatter: {} as ResultFormatter,
  },

  searchBy: {
    searchableIndices: [] as SearchableIndex[],
  },

  capabilities: {} as DataCapabilities,

  // Sources with strategy overrides
  sources: {
    internal: {
      id: 'internal',
      // Uses base hub strategies
      capabilities: {} as DataCapabilities,
    },
    external: {
      id: 'external',
      // Override for external API
      strategies: {
        requestBuilder: {} as RequestBuilder,
      },
      capabilities: {} as DataCapabilities,
    },
  },

  // Default values
  defaults: {},
};
