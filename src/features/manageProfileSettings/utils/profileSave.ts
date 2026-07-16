import { deletePreferredProfile, savePreferredProfile } from '@/common/api/profiles.api';
import { createUpdatedPreferredProfiles } from '@/common/helpers/profileActions.helper';

import type { DeletePreferredProfileSettingsParams, SavePreferredProfileSettingsParams } from '@/features/profiles';

import { type PreferredProfiles } from '@/store';

interface DeterminePreferredSettingsParams {
  profileId: string | number;
  profileSettingsId: string | number;
  preferredProfileSettings: ProfileSettingsMetaList | undefined;
  isPreferredProfileSettings: boolean;
  remove: (params: DeletePreferredProfileSettingsParams) => void;
  update: (params: SavePreferredProfileSettingsParams) => void;
}

const saveAndUpdatePreferredProfiles = async (
  selectedProfile: ProfileDTO,
  preferredProfiles: ProfileDTO[],
  setPreferredProfiles: (value: PreferredProfiles | SetState<PreferredProfiles>) => void,
) => {
  await savePreferredProfile(selectedProfile.id, selectedProfile.resourceType);
  const updatedPreferredProfiles = createUpdatedPreferredProfiles({
    profileId: String(selectedProfile.id),
    profileName: selectedProfile.name,
    resourceTypeURL: selectedProfile.resourceType,
    currentPreferredProfiles: preferredProfiles,
  });
  setPreferredProfiles(updatedPreferredProfiles);
};

const deleteAndUpdatePreferredProfiles = async (
  selectedProfile: ProfileDTO,
  preferredProfiles: ProfileDTO[],
  setPreferredProfiles: (value: PreferredProfiles | SetState<PreferredProfiles>) => void,
) => {
  await deletePreferredProfile(selectedProfile.resourceType as ResourceTypeURL);
  const updatedPreferredProfiles = preferredProfiles.filter(profile => profile.id !== String(selectedProfile.id));
  setPreferredProfiles(updatedPreferredProfiles);
};

export const determinePreferredAction = (
  selectedProfile: ProfileDTO,
  preferredProfiles: ProfileDTO[],
  isTypeDefaultProfile: boolean,
) => {
  const preferred = preferredProfiles.find(p => p.resourceType === selectedProfile.resourceType);

  if (preferred) {
    if (preferred.id === String(selectedProfile.id)) {
      if (!isTypeDefaultProfile) {
        // This was the default profile for this resource type but is now not, so delete.
        return deleteAndUpdatePreferredProfiles;
      }
    } else if (isTypeDefaultProfile) {
      // Another profile was the default for this resource type but this one now is, so save.
      return saveAndUpdatePreferredProfiles;
    }
  } else if (isTypeDefaultProfile) {
    // No default was set for this resource type, set it to this one now.
    return saveAndUpdatePreferredProfiles;
  }

  // All other cases do not require action.
  return null;
};

export const determinePreferredSettingsAction = ({
  profileId,
  profileSettingsId,
  preferredProfileSettings,
  isPreferredProfileSettings,
  remove,
  update,
}: DeterminePreferredSettingsParams) => {
  const preferred = preferredProfileSettings?.find(p => p.profileId === profileId);

  if (preferred) {
    if (preferred.id === profileSettingsId) {
      if (!isPreferredProfileSettings) {
        // This was preferred but is now not; delete the preferred settings for this profile.
        remove({ profileId });
      }
    } else if (isPreferredProfileSettings) {
      // This was not preferred but now is; update to set it as the preferred settings.
      if (typeof profileSettingsId === 'number') {
        update({ profileId, profileSettingsId });
      } else {
        // Unless profileSettingsId is PROFILE_SETTINGS_DEFAULT_OPTION (a string),
        // in which case remove preferred settings for this profile.
        remove({ profileId });
      }
    }
  } else if (isPreferredProfileSettings) {
    // There was no preferred settings, but now this is; update to set it as the preferred settings.
    if (typeof profileSettingsId === 'number') update({ profileId, profileSettingsId });
  }
};

export const generateSettings = (
  profileId: string | number,
  selectedComponents: ProfileSettingComponent[],
  unusedComponents: ProfileSettingComponent[],
  isSettingsActive: boolean,
  name: string,
) => {
  const settingsChildren = [] as ProfileSettingsChildProperties[];

  selectedComponents.forEach((child, index) => {
    settingsChildren.push({
      id: child.id,
      visible: true,
      order: index + 1,
    });
  });

  unusedComponents.forEach((child, index) => {
    settingsChildren.push({
      id: child.id,
      visible: false,
      order: selectedComponents.length + index + 1,
    });
  });

  return {
    profileId,
    name,
    active: isSettingsActive,
    children: settingsChildren,
  } as ProfileSettings;
};
