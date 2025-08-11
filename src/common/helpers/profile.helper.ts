import { ResourceType } from '@common/constants/record.constants';
import { PROFILE_CONFIG } from '@src/configs';

export const getProfileConfig = ({
  resourceType,
  profileId,
  referenceProfileId,
}: {
  resourceType?: ResourceType;
  profileId?: string | null;
  referenceProfileId?: string;
}) => {
  const { defaultProfileIds, rootEntry } = PROFILE_CONFIG;
  let ids: number[] = [];

  if (resourceType === ResourceType.work) {
    ids = typeof profileId === 'string' ? [Number(profileId)] : [defaultProfileIds.work];
  } else if (resourceType === ResourceType.instance) {
    ids = typeof profileId === 'string' ? [Number(profileId)] : [defaultProfileIds.instance];
  } else {
    ids = [];
  }

  if (referenceProfileId) {
    ids.push(Number(referenceProfileId));
  }

  return { ids, rootEntry: rootEntry as ProfileNode };
};

export const getMappedResourceType = (resourceTypeValue: string | null) => {
  return resourceTypeValue === 'work' ? ResourceType.work : ResourceType.instance;
};
