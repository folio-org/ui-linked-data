import { DEFAULT_INACTIVE_SETTINGS } from '@common/constants/profileSettings.constants';
import { fetchProfileSettings } from '@common/api/profiles.api';
import { detectDrift } from '@common/helpers/profileSettingsDrift.helper';
import { useProfileState } from '@src/store';

export const useLoadProfileSettings = () => {
  const { profileSettings, setProfileSettings } = useProfileState(['profileSettings', 'setProfileSettings']);

  const sortProfileSettingsChildren = (settings: ProfileSettings) => {
    settings.children?.sort((a, b) => {
      if (a.visible && !b.visible) {
        return -1;
      } else if (!a.visible && b.visible) {
        return 1;
      } else if (!a.visible && !b.visible) {
        return 0;
      } else if (a.order !== undefined && b.order === undefined) {
        // .order shouldn't be undefined if both are visible,
        // but handle those cases anyways.
        return -1;
      } else if (a.order === undefined && b.order !== undefined) {
        return 1;
      } else if (a.order === undefined && b.order === undefined) {
        return 0;
      } else {
        return a.order! - b.order!;
      }
    });
  };

  const loadProfileSettings = async (profileId: string | number | undefined, profile: Profile) => {
    if (profileId === undefined) {
      return DEFAULT_INACTIVE_SETTINGS;
    }

    if (profileSettings[profileId]) {
      return profileSettings[profileId];
    }

    const settings = await fetchProfileSettings(profileId);
    sortProfileSettingsChildren(settings);
    const settingsWithDrift = detectDrift(profile, settings);
    setProfileSettings(prev => ({ ...prev, [profileId]: settingsWithDrift }));

    return settingsWithDrift;
  };

  return {
    loadProfileSettings,
  };
};
