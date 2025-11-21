import type {
  DataCapabilities,
  RequestBuilder,
  ResponseTransformer,
  ResultFormatter,
  SearchableIndex,
  SearchTypeConfig,
} from '../types';

/**
 * Authorities Search Type Configuration
 *
 * Supports two segments:
 * - search: Standard keyword-based search
 * - browse: Alphabetical browsing by name/title
 */
export const authoritiesConfig: SearchTypeConfig = {
  id: 'authorities',

  // Base strategies for all authorities searches
  strategies: {
    requestBuilder: {} as RequestBuilder,
    responseTransformer: {} as ResponseTransformer,
    resultFormatter: {} as ResultFormatter,
  },

  // SearchBy configuration
  searchBy: {
    searchableIndices: [] as SearchableIndex[],
  },

  // Data capabilities
  capabilities: {} as DataCapabilities,

  // Segments with strategy overrides
  segments: {
    search: {
      id: 'search',
      // Inherits strategies from parent
      searchBy: {
        searchableIndices: [] as SearchableIndex[],
      },
      capabilities: {} as DataCapabilities,
    },
    browse: {
      id: 'browse',
      // Override request builder for browse mode
      strategies: {
        requestBuilder: {} as RequestBuilder,
      },
      searchBy: {
        searchableIndices: [] as SearchableIndex[],
      },
      capabilities: {} as DataCapabilities,
    },
  },

  // Default values
  defaults: {},
};
