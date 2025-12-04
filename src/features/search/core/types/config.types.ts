import { SearchStrategies } from './strategies.types';

/**
 * Core search configuration
 * Business logic only, no UI
 */

// Searchable index (core definition - just the data identifier)
export interface SearchableIndex {
  value: string;
  // Note: UI properties like labelId, placeholder are in SearchableIndexUI
}

export interface SearchByConfig {
  searchableIndices: SearchableIndex[];
}

// Data capabilities (what the API/backend supports)
export interface DataCapabilities {
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Atomic Search Type Configuration
 *
 * Represents a self-contained search configuration with its own strategies,
 * searchBy options, and defaults. No nested segments or sources.
 *
 * Use composite keys to identify variants:
 * - "resources" - Simple resource search
 * - "authorities:search" - Authorities keyword search
 * - "authorities:browse" - Authorities alphabetical browse
 * - "hubs:internal" - Internal hub registry
 * - "hubs:external" - External hub services
 */
export interface SearchTypeConfig {
  id: string; // 'resources' | 'hubs:internal' | 'hubs:external' | 'authorities:search' | 'authorities:browse'
  // Default strategies for this search type (can be overridden by segments/sources)
  strategies?: SearchStrategies;

  // Search configuration
  searchBy?: SearchByConfig;

  // Data capabilities
  capabilities?: DataCapabilities;

  // Default values
  defaults?: {
    searchBy?: string;
    query?: string;
    limit?: number;
    offset?: number;
  };
}
