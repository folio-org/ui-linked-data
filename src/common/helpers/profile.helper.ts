import { ResourceType } from '@common/constants/record.constants';
import { PROFILES_CONFIG } from '@src/configs';

export const getProfileConfig = ({
  profileName,
  resourceType,
  profileId,
  referenceProfileId,
}: {
  profileName: keyof typeof PROFILES_CONFIG;
  resourceType?: ResourceType;
  profileId?: string | null;
  referenceProfileId?: string;
}) => {
  if (!PROFILES_CONFIG[profileName]) {
    throw new Error(`Profile with ID ${profileName} does not exist in the configuration.`);
  }

  const { api, rootEntry } = PROFILES_CONFIG[profileName];
  let ids: number[] = [];

  if (resourceType === ResourceType.work) {
    ids = typeof profileId === 'string' ? [Number(profileId)] : [api.work];
  } else if (resourceType === ResourceType.instance) {
    ids = typeof profileId === 'string' ? [Number(profileId)] : [api.instance];
  } else {
    ids = [api.profile];
  }

  if (referenceProfileId) {
    ids.push(Number(referenceProfileId));
  }

  return { ids, rootEntry: rootEntry as ProfileNode };
};
