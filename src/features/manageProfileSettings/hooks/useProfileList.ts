import { fetchProfiles } from '@common/api/profiles.api';
import { useProfileState } from '@/store';
import { TYPE_URIS } from '@common/constants/bibframe.constants';
import { logger } from '@common/services/logger';

export const useProfileList = () => {
  const { availableProfiles, setAvailableProfiles } = useProfileState(['availableProfiles', 'setAvailableProfiles']);

  // Loads available profiles if they haven't been loaded yet
  const loadAvailableProfiles = async (resourceTypeURL: ResourceTypeURL) => {
    if (!availableProfiles?.[resourceTypeURL]?.length) {
      try {
        const result = await fetchProfiles(resourceTypeURL);

        setAvailableProfiles(prev => {
          return {
            ...prev,
            [resourceTypeURL]: result,
          };
        });

        return result;
      } catch (error) {
        logger.error('Failed to load available profiles:', error);
        throw error;
      }
    }

    return availableProfiles?.[resourceTypeURL];
  };

  const loadAllAvailableProfiles = async () => {
    for (const type of Object.values(TYPE_URIS)) {
      await loadAvailableProfiles(type as ResourceTypeURL);
    }
  };

  return {
    loadAvailableProfiles,
    loadAllAvailableProfiles,
  };
};
