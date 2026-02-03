import { Dispatch, SetStateAction } from 'react';

import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useManageProfileSettingsState } from '@/store';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { useMoveBetweenLists } from './useMoveBetweenLists';

export const useDragHandlers = (
  startingList: ComponentType | null,
  unused: ProfileSettingComponent[],
  selected: ProfileSettingComponent[],
  draggingUnused: ProfileSettingComponent[],
  draggingSelected: ProfileSettingComponent[],
  setStartingList: Dispatch<SetStateAction<ComponentType | null>>,
  updateState: (
    activeId: string | null,
    startingList: ComponentType | null,
    unused: ProfileSettingComponent[] | null,
    selected: ProfileSettingComponent[] | null,
    draggingUnused: ProfileSettingComponent[],
    draggingSelected: ProfileSettingComponent[],
    cursorStyle: string,
  ) => void,
  listFromId: (id: string) => string,
  setUnused: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
  setSelected: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
) => {
  const { setIsModified } = useManageProfileSettingsState(['setIsModified']);

  const { moveUnusedToSelected, moveSelectedToUnused } = useMoveBetweenLists(setUnused, setSelected);

  const handleDragStart = (event: DragStartEvent) => {
    updateState(
      event.active.id as string,
      event.active.data.current?.sortable.containerId,
      null,
      null,
      unused,
      selected,
      'grabbing',
    );
  };

  const handleDragCancel = () => {
    updateState(null, null, draggingUnused, draggingSelected, [], [], 'default');
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

    updateState(null, null, null, null, [], [], 'default');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const targetId = over.data.current !== undefined ? over.data.current.sortable.containerId : over.id;
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
