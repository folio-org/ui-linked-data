import type { SearchTypeConfig } from '../types';
import { ResourcesRequestBuilder } from '../strategies/requestBuilders';
import { ResourcesResponseTransformer } from '../strategies/responseTransformers';

/**
 * Resources Search Type Configuration
 *
 * Simple search type without segments or sources.
 */
export const resourcesConfig: SearchTypeConfig = {
  id: 'resources',

  // Base strategies
  strategies: {
    requestBuilder: new ResourcesRequestBuilder(),
    responseTransformer: new ResourcesResponseTransformer(),
    resultFormatter: undefined,
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
