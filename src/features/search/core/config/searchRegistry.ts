import type { SearchRegistry, SearchTypeConfig } from '../types';
import { resourcesConfig } from './resources.config';
import { authoritiesConfig } from './authorities.config';
import { hubsConfig } from './hubs.config';

/**
 * Search Registry
 * Central registry of all search type configurations
 */
export const searchRegistry: SearchRegistry = {
  resources: resourcesConfig,
  authorities: authoritiesConfig,
  hubs: hubsConfig,
};

// Helper function to get a search config by ID
export function getSearchConfig(searchTypeId: keyof typeof searchRegistry): SearchTypeConfig | undefined {
  return searchRegistry[searchTypeId];
}
