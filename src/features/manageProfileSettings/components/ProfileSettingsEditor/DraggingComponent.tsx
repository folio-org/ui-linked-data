import { FC } from 'react';
import { type ProfileSettingComponent } from './ProfileSettingsEditor';
import { BaseComponent, ComponentType } from './BaseComponent';

type DraggingComponentProps = {
  component: ProfileSettingComponent;
};

export const DraggingComponent: FC<DraggingComponentProps> = props => {
  return <BaseComponent type={ComponentType.dragging} {...props} />;
};
