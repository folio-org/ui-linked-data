import type { SearchTypeConfig } from '../types';
import { ResourcesRequestBuilder } from '../strategies/requestBuilders';
import { ResourcesResponseTransformer } from '../strategies/responseTransformers';
import { ResourcesResultFormatter } from '../strategies/resultFormatters';

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
    resultFormatter: new ResourcesResultFormatter(),
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
    limit: 10, // API fetches 100 results
    offset: 0,
  },
};
