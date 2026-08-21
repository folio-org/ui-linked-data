import { FC, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';

import { useDismissMenu } from '@/common/hooks/useDismissMenu';
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
  const menuRef = useRef<HTMLButtonElement>(null);
  const menuContainerRef = useRef<HTMLUListElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const { formatMessage } = useIntl();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    animateLayoutChanges: args => !args.isSorting || defaultAnimateLayoutChanges(args),
    data: {
      component,
      dragEnd: () => {
        if (dataRef.current) {
          dataRef.current.parentElement?.focus();
        }
      },
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { isOpen: isMenuEnabled, toggle: toggleIsMenuEnabled } = useDismissMenu(menuContainerRef);

  useEffect(() => {
    if (isMenuEnabled) {
      (menuRef.current ?? menuContainerRef.current)?.focus();
    }
  }, [isMenuEnabled]);

  return (
    <div
      className={classNames('component', isDragging ? 'dragging' : '')}
      data-testid={`component-${component.id}`}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div ref={dataRef} className="name">
        <div ref={ref} className="grab" data-no-dnd="true">
          <Button
            data-testid="activate-menu"
            ariaLabel={formatMessage({ id: 'ld.aria.moveComponentOptions' })}
            ariaHaspopup="menu"
            ariaExpanded={isMenuEnabled}
            type={ButtonType.Icon}
            onClick={toggleIsMenuEnabled}
          >
            <DragDrop />
          </Button>
          {isMenuEnabled && (
            <ul
              data-testid="move-menu"
              className="move-menu"
              role="menu" // NOSONAR
              aria-label={formatMessage({ id: 'ld.aria.moveComponentOptions' })}
              ref={menuContainerRef}
              tabIndex={-1}
            >
              <li className="move-menu-content" role="none">
                {component.mandatory ? (
                  <Button type={ButtonType.Text} disabled={true} role="menuitem">
                    <FormattedMessage id="ld.moveUnavailable" />
                  </Button>
                ) : (
                  <Button
                    type={ButtonType.Text}
                    onClick={moveFn}
                    data-testid="move-action"
                    role="menuitem"
                    ref={menuRef}
                  >
                    <FormattedMessage id={type === ComponentType.selected ? 'ld.moveToUnused' : 'ld.moveToSelected'} />
                  </Button>
                )}
              </li>
            </ul>
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
            <Button
              data-testid="nudge-up"
              type={ButtonType.Icon}
              onClick={upFn}
              ariaLabel={formatMessage({ id: 'ld.aria.nudgeComponentUp' })}
            >
              <ArrowUp />
            </Button>
          )}
          {index !== size && (
            <Button
              data-testid="nudge-down"
              type={ButtonType.Icon}
              onClick={downFn}
              ariaLabel={formatMessage({ id: 'ld.aria.nudgeComponentDown' })}
            >
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
