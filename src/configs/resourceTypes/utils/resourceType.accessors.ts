import { ResourceType } from '@/common/constants/record.constants';

import { RESOURCE_TYPE_REGISTRY } from '../resourceType.config';
import type { ResourceTypeDefinition, ResourceTypeReference } from '../resourceType.types';

export type ResourceTypeInput = ResourceType | string | null | undefined;

export type ResourceTypeURLInput = ResourceTypeURL | null | undefined;

/**
 * Get the full configuration for a resource type.
 * Falls back to instance type if the type is not found in the registry.
 */
export const getResourceTypeConfig = (type: ResourceTypeInput): ResourceTypeDefinition => {
  const normalizedType = type as ResourceType;

  if (normalizedType && normalizedType in RESOURCE_TYPE_REGISTRY) {
    return RESOURCE_TYPE_REGISTRY[normalizedType];
  }

  return RESOURCE_TYPE_REGISTRY[ResourceType.instance];
};

/**
 * Get the ResourceType from a type URL.
 * Falls back to instance type if the type URL is not found in the registry.
 */
export const getResourceTypeFromURL = (typeURL: ResourceTypeURLInput): ResourceType => {
  if (typeURL) {
    for (const type in RESOURCE_TYPE_REGISTRY) {
      if (RESOURCE_TYPE_REGISTRY[type as ResourceType].uri === typeURL) {
        return type as ResourceType;
      }
    }
  }

  return ResourceType.instance;
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

export const getUri = (type: ResourceTypeInput): string => {
  return getResourceTypeConfig(type).uri;
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

export const getProfileLabelId = (type: ResourceTypeInput): string => {
  return getResourceTypeConfig(type).labelId;
};

export const getSearchSegment = (type: ResourceTypeInput): string => {
  return getResourceTypeConfig(type).search.segment;
};
