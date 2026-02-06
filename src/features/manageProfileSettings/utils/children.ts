import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

export const componentFromId = (id: string, profile: Profile): ProfileSettingComponent => {
  return {
    id: id,
    name: profile.find(p => p.id === id)?.displayName ?? '',
  };
};

export const getProfileChildren = (profile: Profile): ProfileSettingComponent[] => {
  const children = profile.find(p => p.type === AdvancedFieldType.block)?.children;
  return (
    children?.map(child => {
      return componentFromId(child, profile);
    }) ?? []
  );
};

export const getSettingsChildren = (
  profile: Profile,
  settings: ProfileSettingsWithDrift,
): ProfileSettingComponent[] => {
  return (
    settings.children
      ?.filter(child => {
        return child.visible === true;
      })
      ?.map(child => {
        return componentFromId(child.id, profile);
      }) ?? []
  );
};

export const childrenDifference = (
  profile: ProfileSettingComponent[],
  settings: ProfileSettingComponent[],
): ProfileSettingComponent[] => {
  return profile.filter(child => {
    return !settings.some(settingsChild => settingsChild.id === child.id);
  });
};
