import { ResourceType } from '@common/constants/record.constants';
import { PROFILES_CONFIG } from '@src/configs';

export const getProfileConfig = (profileId: keyof typeof PROFILES_CONFIG, pageType: ResourceType) => {
  if (!PROFILES_CONFIG[profileId]) {
    throw new Error(`Profile with ID ${profileId} does not exist in the configuration.`);
  }

  const { api, rootEntry } = PROFILES_CONFIG[profileId];
  let ids: number[] = [];

  if (pageType === ResourceType.work) {
    ids = [api.work];
  } else if (pageType === ResourceType.instance) {
    ids = [api.work, api.instance];
  } else {
    ids = [api.profile];
  }

  return { ids, rootEntry: rootEntry as ProfileNode };
};
