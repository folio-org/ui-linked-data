import type { SearchTypeConfig } from '../types';
import { resourcesConfig } from './resources.config';
import { authoritiesSearchConfig } from './authoritiesSearch.config';
import { authoritiesBrowseConfig } from './authoritiesBrowse.config';
import { hubsInternalConfig } from './hubsInternal.config';
import { hubsExternalConfig } from './hubsExternal.config';

/**
 * Atomic Search Registry
 *
 * Central registry of all atomic search configurations.
 * Each config is self-contained with its own strategies, searchBy, and defaults.
 */
export const searchRegistry: Record<string, SearchTypeConfig> = {
  // Resources (simple type)
  resources: resourcesConfig,

  // Authorities variants
  'authorities:search': authoritiesSearchConfig,
  'authorities:browse': authoritiesBrowseConfig,

  // Hubs - base config defaults to internal
  hubs: hubsInternalConfig,
  'hubs:internal': hubsInternalConfig,
  'hubs:external': hubsExternalConfig,
};

export function getSearchConfig(key: string): SearchTypeConfig | undefined {
  return searchRegistry[key];
}
