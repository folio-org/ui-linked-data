import { ResourceType } from '@/common/constants/record.constants';
import { getResourceTypeConfig, createRootEntry, mapToResourceType } from '@/configs/resourceTypes';

interface GetProfileConfigParams {
  resourceType?: ResourceType | string | null;
  profileId?: string | number | null;
  referenceProfileId?: string;
}

/**
 * Get profile configuration for a resource type.
 * Uses the Resource Type Registry for all configuration.
 */
export const getProfileConfig = ({ resourceType, profileId, referenceProfileId }: GetProfileConfigParams) => {
  const mappedType = mapToResourceType(resourceType as string);
  const config = getResourceTypeConfig(mappedType);

  // Determine profile IDs to load
  const isValidProfileId = typeof profileId === 'number' || typeof profileId === 'string';
  const ids: (string | number)[] = isValidProfileId ? [profileId] : [config.defaultProfileId];

  // Add reference profile ID if provided (for Work/Instance dual-profile loading)
  if (referenceProfileId) {
    ids.push(referenceProfileId);
  }

  return {
    ids,
    rootEntry: createRootEntry(mappedType) as ProfileNode,
  };
};
