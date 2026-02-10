import { Dispatch, SetStateAction, startTransition } from 'react';

import { Active, Over } from '@dnd-kit/core';

interface UseMoveBetweenListsParams {
  unused: ProfileSettingComponent[];
  selected: ProfileSettingComponent[];
  setUnused: Dispatch<SetStateAction<ProfileSettingComponent[]>>;
  setSelected: Dispatch<SetStateAction<ProfileSettingComponent[]>>;
}

export const useMoveBetweenLists = ({ unused, selected, setUnused, setSelected }: UseMoveBetweenListsParams) => {
  const moveBetweenLists = (
    sourceFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    destinationFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    source: ProfileSettingComponent[],
    destination: ProfileSettingComponent[],
    active: Active,
    over: Over,
  ) => {
    let toMove: ProfileSettingComponent | null = null;

    const sourceOldIndex = source.findIndex(p => p.id === active.id);
    const sourceNext = [...source];
    if (sourceOldIndex >= 0) {
      toMove = sourceNext.splice(sourceOldIndex, 1)[0];
    }

    let destinationNext = [...destination];
    if (toMove) {
      if (destination.length > 0) {
        const destinationNewIndex = destination.findIndex(p => p.id === over.id);
        if (destinationNewIndex === -1) {
          destinationNext.push(toMove);
        } else {
          destinationNext = [
            ...destination.slice(0, destinationNewIndex),
            toMove,
            ...destination.slice(destinationNewIndex),
          ];
        }
      } else {
        destinationNext = [toMove];
      }
    }

    // Mark state setting as non-urgent so boundary cases where an item is
    // rapidly flipping between source and destination do not cause
    // breaking 'maximum update depth' errors.
    startTransition(() => {
      sourceFn(sourceNext);
      destinationFn(destinationNext);
    });
  };

  const moveUnusedToSelected = (active: Active, over: Over) => {
    moveBetweenLists(setUnused, setSelected, unused, selected, active, over);
  };

  const moveSelectedToUnused = (active: Active, over: Over) => {
    moveBetweenLists(setSelected, setUnused, selected, unused, active, over);
  };

  return {
    moveUnusedToSelected,
    moveSelectedToUnused,
  };
};
