import { FC } from 'react';
import { type ProfileSettingComponent } from './ProfileSettingsEditor';
import { BaseComponent, ComponentType } from './BaseComponent';

type DraggingComponentProps = {
  component: ProfileSettingComponent;
};

export const DraggingComponent: FC<DraggingComponentProps> = ({ component }) => {
  return <BaseComponent type={ComponentType.dragging} component={component} />;
};
