import { ResourceType } from '@common/constants/record.constants';
import { PROFILES_CONFIG } from '@src/configs';

export const getProfileConfig = ({
  profileName,
  resourceType,
  profileId,
}: {
  profileName: keyof typeof PROFILES_CONFIG;
  resourceType?: ResourceType;
  profileId?: number | null;
}) => {
  if (!PROFILES_CONFIG[profileName]) {
    throw new Error(`Profile with ID ${profileName} does not exist in the configuration.`);
  }

  const { api, rootEntry } = PROFILES_CONFIG[profileName];
  let ids: number[] = [];

  if (resourceType === ResourceType.work) {
    ids = [api.work];
  } else if (resourceType === ResourceType.instance) {
    ids = [api.work, profileId ?? api.instance];
  } else {
    ids = [api.profile];
  }

  return { ids, rootEntry: rootEntry as ProfileNode };
};
