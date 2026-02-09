/**
 * Known Hub source URI patterns
 * Used to reconstruct full Hub URI from token
 */
export const HUB_SOURCE_URI_PATTERNS: Record<string, string> = {
  libraryOfCongress: 'http://id.loc.gov/resources/hubs',
};

export const DEFAULT_HUB_SOURCE = 'libraryOfCongress';
