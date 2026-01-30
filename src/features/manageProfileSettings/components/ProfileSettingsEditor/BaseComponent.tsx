import { FC } from 'react';
import classNames from 'classnames';
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragDrop from '@src/assets/drag-drop-16.svg?react';
import ArrowUp from '@src/assets/arrow-up-16.svg?react';
import ArrowDown from '@src/assets/arrow-down-16.svg?react';
import { Button, ButtonType } from '@/components/Button';
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
  upFn?: () => void;
  downFn?: () => void;
};

export const BaseComponent: FC<BaseComponentProps> = ({ size, index, component, type, upFn, downFn }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    animateLayoutChanges: args => !args.isSorting || defaultAnimateLayoutChanges(args),
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className={classNames('component', isDragging ? 'dragging' : '')} style={style} ref={setNodeRef}>
      <div className="name">
        <div className="grab" {...attributes} {...listeners}>
          <DragDrop />
        </div>
        {type === ComponentType.selected && !isDragging ? index + '. ' : ''}
        {component.name}
      </div>
      {type === ComponentType.selected && !isDragging ? (
        <div className="adjust">
          {index !== 1 && (
            <Button type={ButtonType.Icon} onClick={upFn}>
              <ArrowUp />
            </Button>
          )}
          {index !== size && (
            <Button type={ButtonType.Icon} onClick={downFn}>
              <ArrowDown />
            </Button>
          )}
          {index === size && index !== 1 && <span className="blank"></span>}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
