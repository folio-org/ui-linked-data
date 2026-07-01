import { useManageProfileSettingsState } from '@/store';

export const useResetSettings = () => {
  const {
    resetIsSettingsActive,
    resetIsModified,
    resetSelectedProfileSettingsMeta,
    resetProfileSettings,
    resetSettingsName,
    resetNextSelectedProfile,
  } = useManageProfileSettingsState();

  const resetSettings = () => {
    resetSettingsExceptModified();
    resetIsModified();
  };

  const resetSettingsExceptModified = () => {
    resetIsSettingsActive();
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
