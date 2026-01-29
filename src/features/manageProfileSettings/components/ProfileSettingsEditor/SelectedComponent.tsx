import { FC } from 'react';
import { type ProfileSettingComponent } from './ProfileSettingsEditor';
import { ComponentType, BaseComponent } from './BaseComponent';

type SelectedComponentProps = {
  size: number;
  index: number;
  component: ProfileSettingComponent;
};

export const SelectedComponent: FC<SelectedComponentProps> = ({ size, index, component }) => {
  return <BaseComponent type={ComponentType.selected} component={component} size={size} index={index} />;
};
