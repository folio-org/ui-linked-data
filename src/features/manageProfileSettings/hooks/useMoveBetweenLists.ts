import { Dispatch, SetStateAction, startTransition } from 'react';

import { Active, Over, UniqueIdentifier } from '@dnd-kit/core';

import { useManageProfileSettingsState } from '@/store';

interface UseMoveBetweenListsParams {
  unused: ProfileSettingComponent[];
  selected: ProfileSettingComponent[];
  setUnused: Dispatch<SetStateAction<ProfileSettingComponent[]>>;
  setSelected: Dispatch<SetStateAction<ProfileSettingComponent[]>>;
}

export const useMoveBetweenLists = ({ unused, selected, setUnused, setSelected }: UseMoveBetweenListsParams) => {
  const { setIsModified, setIsSettingsActive } = useManageProfileSettingsState([
    'setIsModified',
    'setIsSettingsActive',
  ]);

  const moveBetweenLists = (
    sourceFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    destinationFn: Dispatch<SetStateAction<ProfileSettingComponent[]>>,
    source: ProfileSettingComponent[],
    destination: ProfileSettingComponent[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier | null,
  ) => {
    let toMove: ProfileSettingComponent | null = null;

    const sourceOldIndex = source.findIndex(p => p.id === activeId);
    const sourceNext = [...source];
    if (sourceOldIndex >= 0) {
      toMove = sourceNext.splice(sourceOldIndex, 1)[0];
    }

    let destinationNext = [...destination];
    if (toMove) {
      if (destination.length > 0) {
        const destinationNewIndex = destination.findIndex(p => p.id === overId);
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
    moveBetweenLists(setUnused, setSelected, unused, selected, active.id, over.id);
  };

  const moveSelectedToUnused = (active: Active, over: Over) => {
    moveBetweenLists(setSelected, setUnused, selected, unused, active.id, over.id);
  };

  const makeMoveComponentIdToSelected = (id: string) => {
    return () => {
      moveBetweenLists(setUnused, setSelected, unused, selected, id, null);
      setIsModified(true);
      setIsSettingsActive(true);
    };
  };

  const makeMoveComponentIdToUnused = (id: string) => {
    return () => {
      moveBetweenLists(setSelected, setUnused, selected, unused, id, null);
      setIsModified(true);
      setIsSettingsActive(true);
    };
  };

  return {
    moveUnusedToSelected,
    moveSelectedToUnused,
    makeMoveComponentIdToSelected,
    makeMoveComponentIdToUnused,
  };
};
