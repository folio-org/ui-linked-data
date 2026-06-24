import { useManageProfileSettingsState } from '@/store';

export const useResetSettings = () => {
  const { resetIsSettingsActive, resetIsModified, resetSelectedProfileSettingsMeta, resetProfileSettings } =
    useManageProfileSettingsState();

  const resetSettings = () => {
    resetIsSettingsActive();
    resetIsModified();
    resetSelectedProfileSettingsMeta();
    resetProfileSettings();
  };

  return {
    resetSettings,
  };
};
