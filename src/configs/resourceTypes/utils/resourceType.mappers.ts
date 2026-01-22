import { ResourceType } from '@/common/constants/record.constants';
import { RESOURCE_TYPE_REGISTRY } from '../resourceType.config';

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

const URI_TO_RESOURCE_TYPE_MAP: Record<string, ResourceType> = Object.values(RESOURCE_TYPE_REGISTRY).reduce(
  (acc, config) => {
    acc[config.uri] = config.type;

    return acc;
  },
  {} as Record<string, ResourceType>,
);

/**
 * Maps a BIBFRAME URI (e.g., 'http://bibfra.me/vocab/lite/Work') to a ResourceType.
 * Used for Edit page where the resource type is determined from the loaded record.
 */
export const mapUriToResourceType = (uri: string | null | undefined): ResourceType | undefined => {
  if (!uri) return undefined;

  return URI_TO_RESOURCE_TYPE_MAP[uri];
};

/**
 * Resolves a ResourceType from either a block URI or a type parameter.
 */
export const resolveResourceType = (
  blockUri: string | null | undefined,
  typeParam: string | null | undefined,
): ResourceType => {
  const fromUri = mapUriToResourceType(blockUri);

  if (fromUri) return fromUri;

  return mapToResourceType(typeParam);
};
