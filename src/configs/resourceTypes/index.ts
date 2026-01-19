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
  hasInstancesList,
  supportsCloning,
  supportsMarcPreview,
  hasReference,
  getReference,
  getDefaultProfileId,
  getProfileBfid,
  getEditSectionPassiveClass,
  createRootEntry,
  mapToResourceType,
} from './resourceType.helpers';
