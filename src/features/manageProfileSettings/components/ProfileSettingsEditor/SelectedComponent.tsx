import { FC } from 'react';
import { type ProfileSettingComponent } from './ProfileSettingsEditor';
import { ComponentType, BaseComponent } from './BaseComponent';

type SelectedComponentProps = {
  size: number;
  index: number;
  component: ProfileSettingComponent;
  upFn?: () => void;
  downFn?: () => void;
};

export const SelectedComponent: FC<SelectedComponentProps> = props => {
  return <BaseComponent type={ComponentType.selected} {...props} />;
};
