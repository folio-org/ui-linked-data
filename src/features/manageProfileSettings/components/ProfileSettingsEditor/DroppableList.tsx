import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { useDroppable } from '@dnd-kit/core';

type DroppableListProps = {
  id: string;
  className: string;
  children: ReactNode;
};

export const DroppableList: FC<DroppableListProps> = ({ id, className, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });
  return (
    <div ref={setNodeRef} data-droppable-id={id} className={classNames(className, isOver ? 'over' : '')}>
      {children}
    </div>
  );
};
