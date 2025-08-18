import { ResourceType } from '@common/constants/record.constants';
import { PROFILE_CONFIG } from '@src/configs';

export const getProfileConfig = ({
  resourceType,
  profileId,
  referenceProfileId,
}: {
  resourceType?: ResourceType;
  profileId?: string | number | null;
  referenceProfileId?: string;
}) => {
  const { defaultProfileIds, rootEntry } = PROFILE_CONFIG;
  let ids: (string | number)[] = [];
  const isValidProfileId = typeof profileId === 'number' || typeof profileId === 'string';

  if (resourceType === ResourceType.work) {
    ids = isValidProfileId ? [profileId] : [defaultProfileIds.work];
  } else if (resourceType === ResourceType.instance) {
    ids = isValidProfileId ? [profileId] : [defaultProfileIds.instance];
  } else {
    ids = [];
  }

  if (referenceProfileId) {
    ids.push(referenceProfileId);
  }

  return { ids, rootEntry: rootEntry as ProfileNode };
};

export const getMappedResourceType = (resourceTypeValue: string | null) => {
  return resourceTypeValue === 'work' ? ResourceType.work : ResourceType.instance;
};
