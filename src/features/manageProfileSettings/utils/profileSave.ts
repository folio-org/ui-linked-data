import { deletePreferredProfile, savePreferredProfile } from '@/common/api/profiles.api';
import { createUpdatedPreferredProfiles } from '@/common/helpers/profileActions.helper';

import { type PreferredProfiles } from '@/store';

const saveAndUpdatePreferredProfiles = async (
  selectedProfile: ProfileDTO,
  preferredProfiles: ProfileDTO[],
  setPreferredProfiles: (value: PreferredProfiles | SetState<PreferredProfiles>) => void,
) => {
  await savePreferredProfile(selectedProfile.id, selectedProfile.resourceType);
  const updatedPreferredProfiles = createUpdatedPreferredProfiles({
    profileId: selectedProfile.id,
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
  const updatedPreferredProfiles = preferredProfiles.filter(profile => profile.id !== selectedProfile.id);
  setPreferredProfiles(updatedPreferredProfiles);
};

export const determinePreferredAction = (
  selectedProfile: ProfileDTO,
  preferredProfiles: ProfileDTO[],
  isTypeDefaultProfile: boolean,
) => {
  const preferred = preferredProfiles.find(p => p.resourceType === selectedProfile.resourceType);

  if (preferred) {
    if (preferred.id === selectedProfile.id) {
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

export const generateSettings = (
  selectedComponents: ProfileSettingComponent[],
  unusedComponents: ProfileSettingComponent[],
  isSettingsActive: boolean,
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
    active: isSettingsActive,
    children: settingsChildren,
  } as ProfileSettings;
};
