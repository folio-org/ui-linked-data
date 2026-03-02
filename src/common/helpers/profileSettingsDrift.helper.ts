import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

export const detectDrift = (profile: Profile, settings: ProfileSettings, resourceTypeURL?: string) => {
  const missingFromSettings: string[] = [];

  profile.forEach(node => {
    if (node.type === AdvancedFieldType.block && resourceTypeURL ? resourceTypeURL === node.uriBFLite : false) {
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
    resourceTypeURL,
    missingFromSettings,
  } as ProfileSettingsWithDrift;
};
