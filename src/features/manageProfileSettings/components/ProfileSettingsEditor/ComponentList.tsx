import { FC, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { ComponentType } from './BaseComponent';
import { DroppableList } from './DroppableList';

type ComponentListProps = {
  components: ProfileSettingComponent[];
  type: ComponentType;
  titleId: string;
  descriptionId: string;
  droppable: boolean;
  containerId: string;
  children: ReactNode;
};

export const ComponentList: FC<ComponentListProps> = ({
  components,
  type,
  titleId,
  descriptionId,
  droppable,
  containerId,
  children,
}) => {
  const Container = droppable ? DroppableList : 'div';

  return (
    <div data-testid="component-list" className={`${type}-components`} aria-labelledby={`${type}-title`}>
      <h4>
        <span id={`${type}-title`} className="title">
          <FormattedMessage id={titleId} />
        </span>
        ({components.length})
      </h4>
      <div className="description">
        <FormattedMessage id={descriptionId} />
      </div>
      <Container id={containerId} className="components">
        <SortableContext id={type} items={components} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </Container>
    </div>
  );
};
