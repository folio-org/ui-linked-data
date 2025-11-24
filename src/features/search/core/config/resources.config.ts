import type { RequestBuilder, ResponseTransformer, ResultFormatter, SearchTypeConfig } from '../types';

/**
 * Resources Search Type Configuration
 *
 * Simple search type without segments or sources.
 */
export const resourcesConfig: SearchTypeConfig = {
  id: 'resources',

  // Base strategies
  strategies: {
    requestBuilder: {} as RequestBuilder,
    responseTransformer: {} as ResponseTransformer,
    resultFormatter: {} as ResultFormatter,
  },

  // SearchBy configuration
  searchBy: {
    searchableIndices: [
      {
        value: 'title',
      },
      {
        value: 'contributor',
      },
      {
        value: 'isbn',
      },
      {
        value: 'lccn',
      },
    ],
  },

  // Data capabilities
  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  // Default values
  defaults: {
    searchBy: 'title',
    query: '',
    limit: 100,
    offset: 0,
  },
};
