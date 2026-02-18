import { Dispatch, SetStateAction } from 'react';

import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useManageProfileSettingsState } from '@/store';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { listFromId } from '../utils/children';
import { useMoveBetweenLists } from './useMoveBetweenLists';

interface UseDragHandlersParams {
  startingList: ComponentType | null;
  cancelDrag: () => void;
  endDrag: () => void;
  setStartingList: Dispatch<SetStateAction<ComponentType | null>>;
  startDrag: (activeId: string, startingList: ComponentType | null) => void;
}

export const useDragHandlers = ({
  startingList,
  cancelDrag,
  endDrag,
  setStartingList,
  startDrag,
}: UseDragHandlersParams) => {
  const { setIsModified, setIsSettingsActive, setUnusedComponents, setSelectedComponents } =
    useManageProfileSettingsState([
      'setIsModified',
      'setIsSettingsActive',
      'setUnusedComponents',
      'setSelectedComponents',
    ]);

  const { moveUnusedToSelected, moveSelectedToUnused } = useMoveBetweenLists();

  const handleDragStart = (event: DragStartEvent) => {
    startDrag(event.active.id as string, event.active.data.current?.sortable.containerId);
  };

  const handleDragCancel = () => {
    cancelDrag();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setIsModified(true);
      setIsSettingsActive(true);

      const targetList = over.data.current?.sortable.containerId;
      if (startingList === ComponentType.selected && targetList === ComponentType.selected) {
        // moving within selected list
        setSelectedComponents(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          const newIndex = prev.findIndex(p => p.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      } else if (startingList === ComponentType.unused && targetList === ComponentType.unused) {
        // moving within unused list
        setUnusedComponents(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          const newIndex = prev.findIndex(p => p.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
      // movement between lists is covered by onDragOver
    }

    endDrag();
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const targetId = over.data.current?.sortable?.containerId ?? over.id;
      const targetList = listFromId(targetId);
      if (startingList === ComponentType.unused && targetList === ComponentType.selected) {
        // move from unused to selected
        moveUnusedToSelected(active, over);
        setStartingList(ComponentType.selected);
      } else if (startingList === ComponentType.selected && targetList === ComponentType.unused) {
        // move from selected to unused
        moveSelectedToUnused(active, over);
        setStartingList(ComponentType.unused);
      }
    }
  };

  return {
    handleDragStart,
    handleDragCancel,
    handleDragOver,
    handleDragEnd,
  };
};
