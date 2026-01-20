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
export type { ResourceTypeInput } from './resourceType.helpers';

export {
  getResourceTypeConfig,
  hasPreview,
  hasReference,
  getReference,
  getDefaultProfileId,
  getProfileBfid,
  getEditSectionPassiveClass,
  getEditPageLayout,
  getPreviewPosition,
  hasSplitLayout,
  createRootEntry,
  mapToResourceType,
} from './resourceType.helpers';
