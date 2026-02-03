import { Dispatch, SetStateAction } from 'react';

import { Active, Over } from '@dnd-kit/core';

export const useMoveBetweenLists = (
  setUnused: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
  setSelected: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
) => {
  const moveBetweenLists = (
    sourceFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    destinationFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    active: Active,
    over: Over,
  ) => {
    let toMove: ProfileSettingComponent;
    sourceFn(prev => {
      const oldIndex = prev.findIndex(p => p.id === active.id);
      if (oldIndex >= 0) {
        toMove = prev.splice(oldIndex, 1)[0];
      }
      return prev;
    });
    destinationFn(prev => {
      if (toMove !== undefined) {
        if (prev.length === 0) {
          return [toMove];
        } else {
          const newIndex = prev.findIndex(p => p.id === over.id);
          return [...prev.slice(0, newIndex), toMove, ...prev.slice(newIndex)];
        }
      }
      return prev;
    });
  };

  const moveUnusedToSelected = (active: Active, over: Over) => {
    moveBetweenLists(setUnused, setSelected, active, over);
  };

  const moveSelectedToUnused = (active: Active, over: Over) => {
    moveBetweenLists(setSelected, setUnused, active, over);
  };

  return {
    moveUnusedToSelected,
    moveSelectedToUnused,
  };
};
