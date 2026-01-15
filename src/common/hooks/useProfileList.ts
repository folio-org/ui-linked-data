import { fetchProfiles } from '@common/api/profiles.api';
import { useProfileState } from '@/store';
import { TYPE_URIS } from '@common/constants/bibframe.constants';

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
      } catch (error) {
        console.error('Failed to load available profiles:', error);
        throw error;
      }
    }
  };

  const loadAllAvailableProfiles = async () => {
    Object.values(TYPE_URIS).forEach(type => {
      loadAvailableProfiles(type as ResourceTypeURL);
    });
  };

  return {
    loadAvailableProfiles,
    loadAllAvailableProfiles,
  };
};
