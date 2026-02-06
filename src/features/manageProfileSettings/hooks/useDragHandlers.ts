import { Dispatch, SetStateAction } from 'react';

import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useManageProfileSettingsState } from '@/store';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { useMoveBetweenLists } from './useMoveBetweenLists';

interface UseDragHandlersParams {
  startingList: ComponentType | null;
  cancelDrag: () => void;
  endDrag: () => void;
  listFromId: (id: string) => string;
  setSelected: Dispatch<SetStateAction<ProfileSettingComponent[]>>;
  setStartingList: Dispatch<SetStateAction<ComponentType | null>>;
  setUnused: Dispatch<SetStateAction<ProfileSettingComponent[]>>;
  startDrag: (activeId: string, startingList: ComponentType | null) => void;
}

export const useDragHandlers = ({
  startingList,
  cancelDrag,
  endDrag,
  listFromId,
  setSelected,
  setStartingList,
  setUnused,
  startDrag,
}: UseDragHandlersParams) => {
  const { setIsModified } = useManageProfileSettingsState(['setIsModified']);

  const { moveUnusedToSelected, moveSelectedToUnused } = useMoveBetweenLists({ setUnused, setSelected });

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

      const targetList = over.data.current?.sortable.containerId;
      if (startingList === ComponentType.selected && targetList === ComponentType.selected) {
        // moving within selected list
        setSelected(prev => {
          const oldIndex = prev.findIndex(p => p.id === active.id);
          const newIndex = prev.findIndex(p => p.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      } else if (startingList === ComponentType.unused && targetList === ComponentType.unused) {
        // moving within unused list
        setUnused(prev => {
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
      const targetId = over.data.current ? over.data.current.sortable.containerId : over.id;
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
