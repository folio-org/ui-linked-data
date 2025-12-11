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

  // Hubs - base config defaults to external
  hubs: hubsExternalConfig,
  'hubs:internal': hubsInternalConfig,
  'hubs:external': hubsExternalConfig,
};

// Helper function to get a search config by ID
export function getSearchCoreConfig(searchTypeId: keyof typeof searchRegistry): SearchTypeConfig | undefined {
  return searchRegistry[searchTypeId];
}

// Resolve an effective core config given a segment and optional source.
// Priority: `${segment}:${source}` -> `segment` -> undefined
export function resolveCoreConfig(segment?: string, source?: string): SearchTypeConfig | undefined {
  if (!segment) return undefined;

  if (source) {
    const compositeKey = `${segment}:${source}`;

    if (searchRegistry[compositeKey]) return searchRegistry[compositeKey];
  }

  if (searchRegistry[segment]) return searchRegistry[segment];

  return undefined;
}
