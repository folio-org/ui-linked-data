import { ResourceType } from '@/common/constants/record.constants';
import { RESOURCE_TYPE_REGISTRY } from './resourceType.config';
import type { ResourceTypeDefinition, ResourceTypeReference } from './resourceType.types';

// TODO: Move these helpers to /src/features/... once the Edit resource feature structure is finalized.

export type ResourceTypeInput = ResourceType | string | null | undefined;

export const getResourceTypeConfig = (type: ResourceTypeInput): ResourceTypeDefinition => {
  const normalizedType = type as ResourceType;

  if (normalizedType && normalizedType in RESOURCE_TYPE_REGISTRY) {
    return RESOURCE_TYPE_REGISTRY[normalizedType as keyof typeof RESOURCE_TYPE_REGISTRY];
  }

  // Default fallback to instance
  return RESOURCE_TYPE_REGISTRY[ResourceType.instance];
};

export const hasPreview = (type: ResourceTypeInput): boolean => {
  return getResourceTypeConfig(type).ui.hasPreview;
};

export const hasReference = (type: ResourceTypeInput): boolean => {
  return !!getResourceTypeConfig(type).reference;
};

export const getReference = (type: ResourceTypeInput): ResourceTypeReference | undefined => {
  return getResourceTypeConfig(type).reference;
};

export const getDefaultProfileId = (type: ResourceTypeInput): number => {
  return getResourceTypeConfig(type).defaultProfileId;
};

export const getProfileBfid = (type: ResourceTypeInput): string => {
  return getResourceTypeConfig(type).profileBfid;
};

export const getEditSectionPassiveClass = (type: ResourceTypeInput): string | undefined => {
  return getResourceTypeConfig(type).ui.editSectionPassiveClass;
};

export const getEditPageLayout = (type: ResourceTypeInput): 'single' | 'split' => {
  return getResourceTypeConfig(type).ui.editPageLayout ?? 'single';
};

export const getPreviewPosition = (type: ResourceTypeInput): 'left' | 'right' | undefined => {
  return getResourceTypeConfig(type).ui.previewPosition;
};

export const hasSplitLayout = (type: ResourceTypeInput): boolean => {
  return getEditPageLayout(type) === 'split';
};

/**
 * Create the root entry for a resource type's profile.
 * Returns a partial ProfileNode that will be completed by the schema generator.
 */
export const createRootEntry = (
  type: ResourceTypeInput,
): Pick<ProfileNode, 'type' | 'displayName' | 'bfid' | 'children' | 'id'> => {
  const config = getResourceTypeConfig(type);

  return {
    type: 'profile',
    displayName: 'Profile',
    bfid: 'lde:Profile',
    children: config.profileChildren,
    id: 'Profile',
  };
};

/**
 * Map derived from ResourceType enum - automatically includes all resource types.
 * Adding a new value to the enum will automatically make it available here.
 */
const RESOURCE_TYPE_MAP: Record<string, ResourceType> = Object.values(ResourceType).reduce(
  (acc, type) => {
    acc[type.toLowerCase()] = type;

    return acc;
  },
  {} as Record<string, ResourceType>,
);

export const mapToResourceType = (value: string | null | undefined): ResourceType => {
  if (!value) return ResourceType.instance;

  const normalized = value.toLowerCase().trim();

  return RESOURCE_TYPE_MAP[normalized] ?? ResourceType.instance;
};
