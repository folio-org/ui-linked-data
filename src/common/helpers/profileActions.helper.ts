import { type AvailableProfiles } from '@src/store';

export const getProfileNameById = ({
  profileId,
  resourceTypeURL,
  availableProfiles,
}: {
  profileId: string | number;
  resourceTypeURL: string;
  availableProfiles: AvailableProfiles | null;
}) => {
  const availableProfile = availableProfiles?.[resourceTypeURL as ResourceTypeURL]?.find(({ id }) => id === profileId);

  return availableProfile?.name || '';
};

export const createUpdatedPreferredProfiles = ({
  profileId,
  resourceTypeURL,
  profileName,
  currentPreferredProfiles,
}: {
  profileId: string | number;
  resourceTypeURL: string;
  profileName: string;
  currentPreferredProfiles: ProfileDTO[] | null;
}) => {
  const preferredProfileIndex =
    currentPreferredProfiles?.findIndex(({ resourceType }) => resourceType === resourceTypeURL) ?? -1;
  const updatedPreferredProfiles = [...(currentPreferredProfiles || [])];
  const newPreferredProfile = {
    id: profileId,
    name: profileName,
    resourceType: resourceTypeURL,
  };

  if (preferredProfileIndex >= 0) {
    updatedPreferredProfiles[preferredProfileIndex] = newPreferredProfile;
  } else {
    updatedPreferredProfiles.push(newPreferredProfile);
  }

  return updatedPreferredProfiles;
};
