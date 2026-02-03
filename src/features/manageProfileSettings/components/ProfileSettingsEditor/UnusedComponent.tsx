import { FC } from 'react';

import { BaseComponent, ComponentType } from './BaseComponent';

type UnusedComponentProps = {
  component: ProfileSettingComponent;
};

export const UnusedComponent: FC<UnusedComponentProps> = props => {
  return <BaseComponent type={ComponentType.unused} {...props} />;
};
