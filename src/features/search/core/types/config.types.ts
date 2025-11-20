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

// Source configuration (internal/external API endpoints)
export interface SourceConfig {
  id: string; // 'internal' | 'external' | custom

  // Strategies can be overridden at source level
  strategies?: Partial<SearchStrategies>;

  // Each source may have different capabilities
  capabilities?: DataCapabilities;
}

// Segment configuration (Search/Browse, Resources/Hubs variants)
export interface SegmentConfig {
  id: string; // 'search' | 'browse' | 'resources' | 'hubs' | custom

  // Strategies can be overridden at segment level
  strategies?: Partial<SearchStrategies>;

  // Segment-specific search configuration
  searchBy?: SearchByConfig;

  // Data capabilities for this segment
  capabilities?: DataCapabilities;

  // Nested segments (e.g., Authorities has Search/Browse sub-segments)
  segments?: Record<string, SegmentConfig>;

  // Sources specific to this segment (e.g., Hubs has internal/external)
  sources?: Record<string, SourceConfig>;
}

// Main search type configuration
// Represents a top-level search type like Resources, Hubs, AuthoritiesSearch, AuthoritiesBrowse
export interface SearchTypeConfig {
  id: string; // 'resources' | 'hubs' | 'authorities-search' | 'authorities-browse'

  // Default strategies for this search type (can be overridden by segments/sources)
  strategies?: SearchStrategies;

  // Search configuration
  searchBy?: SearchByConfig;

  // Data capabilities
  capabilities?: DataCapabilities;

  // Segments within this search type (e.g., Authorities → Search/Browse)
  segments?: Record<string, SegmentConfig>;

  // Sources for this search type (e.g., Hubs → internal/external)
  sources?: Record<string, SourceConfig>;

  // Default values
  defaults?: {
    segment?: string;
    source?: string;
    searchBy?: string;
    query?: string;
    limit?: number;
    offset?: number;
  };
}

// Registry of all search types
export interface SearchRegistry {
  [searchTypeId: string]: SearchTypeConfig;
}
