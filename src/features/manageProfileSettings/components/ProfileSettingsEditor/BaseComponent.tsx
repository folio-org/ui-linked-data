import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragDrop from '@src/assets/drag-drop-16.svg?react';
import ArrowUp from '@src/assets/arrow-up-16.svg?react';
import ArrowDown from '@src/assets/arrow-down-16.svg?react';
import { type ProfileSettingComponent } from './ProfileSettingsEditor';

export enum ComponentType {
  unused = 'unused',
  selected = 'selected',
  dragging = 'dragging',
}

type BaseComponentProps = {
  size?: number;
  index?: number;
  component: ProfileSettingComponent;
  type: ComponentType;
};

export const BaseComponent: FC<BaseComponentProps> = ({ size, index, component, type }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: component.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="component" style={style} ref={setNodeRef}>
      <div className="name">
        <div className="grab" {...attributes} {...listeners}>
          <DragDrop />
        </div>
        {type === ComponentType.selected ? index + '. ' : ''}
        {component.name}
      </div>
      {type === ComponentType.selected ? (
        <div className="adjust">
          {index !== 1 && <ArrowUp />}
          {index !== size && <ArrowDown />}
          {index === size && index !== 1 && <span className="blank"></span>}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
