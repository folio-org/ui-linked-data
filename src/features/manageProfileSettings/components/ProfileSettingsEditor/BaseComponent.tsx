import { FC } from 'react';

import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';

import { Button, ButtonType } from '@/components/Button';

import ArrowDown from '@/assets/arrow-down-16.svg?react';
import ArrowUp from '@/assets/arrow-up-16.svg?react';
import DragDrop from '@/assets/drag-drop-16.svg?react';

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
    <div
      className={classNames('component', isDragging ? 'dragging' : '')}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div className="name">
        <div className="grab">
          <DragDrop />
        </div>
        {type === ComponentType.selected && !isDragging ? index + '. ' : ''}
        {component.name}
      </div>
      {type === ComponentType.selected && !isDragging ? (
        <div className="adjust" data-no-dnd="true">
          {index !== 1 && (
            <Button data-testid="nudge-up" type={ButtonType.Icon} onClick={upFn}>
              <ArrowUp />
            </Button>
          )}
          {index !== size && (
            <Button data-testid="nudge-down" type={ButtonType.Icon} onClick={downFn}>
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
