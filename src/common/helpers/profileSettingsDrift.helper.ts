import { AdvancedFieldType } from '../constants/uiControls.constants';

export const detectDrift = (profile: Profile, settings: ProfileSettings) => {
  const missingFromSettings: string[] = [];

  profile.forEach(node => {
    if (node.type === AdvancedFieldType.block) {
      node.children?.forEach(nodeChild => {
        const settingsMatch = settings.children?.find(child => child.id === nodeChild);
        if (!settingsMatch) {
          missingFromSettings.push(nodeChild);
        }
      });
    }
  });

  return {
    ...settings,
    missingFromSettings,
  } as ProfileSettingsWithDrift;
};
