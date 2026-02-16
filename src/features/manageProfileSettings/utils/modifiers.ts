import { restrictToParentElement } from '@dnd-kit/modifiers';

import { componentFromId } from './children';

export const chooseModifiers = (activeId: string | null, fullProfile: Profile | null) => {
  if (fullProfile && activeId) {
    const active = componentFromId(activeId, fullProfile);
    if (active?.mandatory) {
      return [restrictToParentElement];
    }
  }
  return [];
};
