import { authoritiesUIRegistry } from './authoritiesUI.config';
import { hubsUIRegistry } from './hubsUI.config';
import { resourcesUIRegistry } from './resourcesUI.config';

// UI Configuration Registry
// Maps search types/segments to their UI configurations
export const searchUIRegistry = {
  authorities: authoritiesUIRegistry,
  hubs: hubsUIRegistry,
  resources: resourcesUIRegistry,
};

// Helper function to get UI config by search type and optional segment
export function getSearchUIConfig(searchType: string, segment?: string) {
  const typeConfig = searchUIRegistry[searchType as keyof typeof searchUIRegistry];

  if (!typeConfig) {
    return undefined;
  }

  // Try to get segment-specific config
  if (segment && 'segments' in typeConfig && typeConfig.segments) {
    const segmentConfig = typeConfig.segments[segment as keyof typeof typeConfig.segments];

    if (segmentConfig) {
      return segmentConfig;
    }
  }

  // Fall back to default config
  return typeConfig.default;
}
