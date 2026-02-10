import { FC, ReactNode } from 'react';

import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';

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
