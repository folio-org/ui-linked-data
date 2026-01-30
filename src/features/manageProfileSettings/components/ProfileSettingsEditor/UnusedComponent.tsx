import { FC } from 'react';
import { type ProfileSettingComponent } from './ProfileSettingsEditor';
import { BaseComponent, ComponentType } from './BaseComponent';

type UnusedComponentProps = {
  component: ProfileSettingComponent;
};

export const UnusedComponent: FC<UnusedComponentProps> = props => {
  return <BaseComponent type={ComponentType.unused} {...props} />;
};
