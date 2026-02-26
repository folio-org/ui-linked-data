import type { SearchTypeConfig } from '../types';
import { authoritiesBrowseConfig } from './authoritiesBrowse.config';
import { authoritiesSearchConfig } from './authoritiesSearch.config';
import { hubsLibraryOfCongressConfig } from './hubsLibraryOfCongress.config';
import { hubsLocalConfig } from './hubsLocal.config';
import { hubsLookupLibraryOfCongressConfig } from './hubsLookupLibraryOfCongress.config';
import { hubsLookupLocalConfig } from './hubsLookupLocal.config';
import { resourcesConfig } from './resources.config';

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

  // Hubs - base config defaults to LoC
  hubs: hubsLibraryOfCongressConfig,
  'hubs:local': hubsLocalConfig,
  'hubs:libraryOfCongress': hubsLibraryOfCongressConfig,

  // Hubs - configs for complex lookups
  hubsLookup: hubsLookupLibraryOfCongressConfig,
  'hubsLookup:local': hubsLookupLocalConfig,
  'hubsLookup:libraryOfCongress': hubsLookupLibraryOfCongressConfig,
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

/**
 * Extract the default source from a segment's base config.
 * If the base config has a composite ID with the pattern `${segment}:${source}`
 * (e.g., base config for 'hubsLookup' has ID 'hubsLookup:libraryOfCongress'),
 * returns the source part ('libraryOfCongress').
 * Otherwise, returns undefined (no default source).
 */
export function getDefaultSourceForSegment(segment?: string): string | undefined {
  if (!segment) return undefined;

  const baseConfig = searchRegistry[segment];
  if (!baseConfig) return undefined;

  // Check if the base config ID is a composite key in the format `${segment}:${source}`
  // This distinguishes source variants (hubsLookup:libraryOfCongress) from
  // category types (authorities:search) where both parts form the segment name
  const expectedPrefix = `${segment}:`;

  if (baseConfig.id.startsWith(expectedPrefix)) {
    // Extract the source part after the segment prefix
    const source = baseConfig.id.substring(expectedPrefix.length);

    return source;
  }

  return undefined;
}
