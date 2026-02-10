import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { UNUSED_EMPTY_ID } from '../constants';

export const listFromId = (id: string) => {
  if (id === UNUSED_EMPTY_ID) {
    return ComponentType.unused;
  }
  return id;
};

// This should only ever return undefined in getSettingsChildren, when
// a stale profile component is leftover in the user settings after having
// been removed from our profile. In any other case, the id will be
// sourced from the profile.
export const componentFromId = (id: string, profile: Profile): ProfileSettingComponent | undefined => {
  const profileComponent = profile.find(p => p.id === id);
  if (profileComponent) {
    return {
      id: id,
      name: profileComponent.displayName,
    };
  }
  return undefined;
};

export const getProfileChildren = (profile: Profile): ProfileSettingComponent[] => {
  const children = profile.find(p => p.type === AdvancedFieldType.block)?.children;
  return (
    children?.map(child => {
      return componentFromId(child, profile)!;
    }) ?? []
  );
};

export const getSettingsChildren = (
  profile: Profile,
  settings: ProfileSettingsWithDrift,
): ProfileSettingComponent[] => {
  return (
    settings.children?.reduce((result: ProfileSettingComponent[], child) => {
      const component = componentFromId(child.id, profile);
      if (child.visible && component) {
        result.push(component);
      }
      return result;
    }, []) ?? []
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
