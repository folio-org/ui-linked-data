// Types
export type {
  ResourceTypeDefinition,
  ResourceTypeUIConfig,
  ResourceTypeReference,
  ResourceTypeRegistry,
} from './resourceType.types';

// Registry
export { RESOURCE_TYPE_REGISTRY } from './resourceType.config';

// Helper types and functions
export type { ResourceTypeInput } from './utils/resourceType.accessors';

export {
  getResourceTypeConfig,
  getResourceTypeFromURL,
  hasPreview,
  hasReference,
  getReference,
  getUri,
  getDefaultProfileId,
  getProfileBfid,
  getEditSectionPassiveClass,
  getEditPageLayout,
  getPreviewPosition,
  hasSplitLayout,
  getProfileLabelId,
  getSearchSegment,
} from './utils/resourceType.accessors';

export { createRootEntry } from './utils/resourceType.profile';

export { mapToResourceType, mapUriToResourceType, resolveResourceType } from './utils/resourceType.mappers';
