import { useIntl } from 'react-intl';

import { Active, Announcements, Over } from '@dnd-kit/core';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { componentFromId, listFromId } from '../utils/children';

interface UseSettingsAnnouncementsParams {
  profile: Profile;
  startingList: ComponentType | null;
  components: ProfileSettingComponent[];
}

export const useSettingsAnnouncements = ({ profile, startingList, components }: UseSettingsAnnouncementsParams) => {
  const { formatMessage } = useIntl();

  const announcements = {
    onDragStart: () => {
      return undefined;
    },
    onDragCancel: () => {
      return undefined;
    },
    onDragOver: () => {
      return undefined;
    },
    onDragEnd: ({ active, over }: { active: Active; over: Over | null }) => {
      let announce;
      const activeComponent = componentFromId(active.id as string, profile);
      if (over && activeComponent) {
        const targetId = over.data.current?.sortable?.containerId ?? over.id;
        const targetList = listFromId(targetId);
        const targetListPosition = components.findIndex(p => p.id === over.id) + 1;
        const finalPosition = targetListPosition === -1 ? components.length : targetListPosition;

        if (startingList === ComponentType.selected && targetList === ComponentType.unused) {
          // move from selected to unused
          announce = formatMessage(
            { id: 'ld.profileSettings.announce.movedToUnused' },
            {
              name: activeComponent.name,
            },
          );
        } else if (startingList === ComponentType.selected && targetList === ComponentType.selected) {
          // move from selected to selected
          announce = formatMessage(
            { id: 'ld.profileSettings.announce.reorderedSelected' },
            {
              name: activeComponent.name,
              order: finalPosition,
            },
          );
        } else if (startingList === ComponentType.unused && targetList === ComponentType.selected) {
          // move from unused to selected
          announce = formatMessage(
            { id: 'ld.profileSettings.announce.movedToSelected' },
            {
              name: activeComponent.name,
              order: finalPosition,
            },
          );
        }
      }
      // ignore everything else
      return announce;
    },
  } as Announcements;

  return {
    announcements,
  };
};
