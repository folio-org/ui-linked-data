import { FC, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

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
  moveFn?: () => void;
};

export const BaseComponent: FC<BaseComponentProps> = ({ size, index, component, type, upFn, downFn, moveFn }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    animateLayoutChanges: args => !args.isSorting || defaultAnimateLayoutChanges(args),
    data: {
      component,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isMenuEnabled, setIsMenuEnabled] = useState(false);

  const toggleIsMenuEnabled = () => {
    setIsMenuEnabled(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsMenuEnabled(false);
      }
    };

    const handleFocusOutside = (event: FocusEvent) => {
      if (!event.relatedTarget || (ref.current && !ref.current.contains(event.relatedTarget as Node))) {
        setIsMenuEnabled(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (ref.current && event.key === 'Escape') {
        setIsMenuEnabled(false);
        ref.current.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('focusout', handleFocusOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('focusout', handleFocusOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div
      className={classNames('component', isDragging ? 'dragging' : '')}
      data-testid={`component-${component.id}`}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div className="name">
        <div ref={ref} className="grab" data-no-dnd="true">
          <Button data-testid="activate-menu" type={ButtonType.Icon} onClick={toggleIsMenuEnabled}>
            <DragDrop />
          </Button>
          {isMenuEnabled && (
            <div data-testid="move-menu" className="move-menu">
              <div className="move-menu-content">
                {!component.mandatory ? (
                  <Button type={ButtonType.Text} onClick={moveFn} data-testid="move-action">
                    <FormattedMessage id={type === ComponentType.selected ? 'ld.moveToUnused' : 'ld.moveToSelected'} />
                  </Button>
                ) : (
                  <Button type={ButtonType.Text} disabled={true}>
                    <FormattedMessage id="ld.moveUnavailable" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        {type === ComponentType.selected && !isDragging ? index + '. ' : ''}
        {component.name}
        {component.mandatory ? (
          <span className="required">
            <FormattedMessage id="ld.requiredAnnotation" />
          </span>
        ) : (
          ''
        )}
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
