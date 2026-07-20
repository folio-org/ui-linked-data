import { useManageProfileSettingsState } from '@/store';

export const useResetSettings = () => {
  const {
    resetIsSettingsActive,
    resetIsModified,
    resetSelectedProfileSettingsMeta,
    resetProfileSettings,
    resetSettingsName,
    resetNextSelectedProfile,
    resetIsPreferredProfileSettings,
  } = useManageProfileSettingsState();

  const resetSettings = () => {
    resetSettingsExceptModified();
    resetIsModified();
  };

  const resetSettingsExceptModified = () => {
    resetIsSettingsActive();
    resetIsPreferredProfileSettings();
    resetSettingsName();
    resetSelectedProfileSettingsMeta();
    resetProfileSettings();
    resetNextSelectedProfile();
  };

  return {
    resetSettings,
    resetSettingsExceptModified,
  };
};
