import { useIntl } from 'react-intl';

import { Active, Announcements, Over } from '@dnd-kit/core';

import { ComponentType } from '../components/ProfileSettingsEditor/BaseComponent';
import { componentFromId } from '../utils/children';

interface UseSettingsAnnouncementsParams {
  profile: Profile;
  startingList: ComponentType | null;
  components: ProfileSettingComponent[];
  listFromId: (id: string) => string;
}

export const useSettingsAnnouncements = ({
  profile,
  startingList,
  components,
  listFromId,
}: UseSettingsAnnouncementsParams) => {
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
      if (over) {
        const activeComponent = componentFromId(active.id as string, profile);
        const targetId = over.data.current !== undefined ? over.data.current.sortable.containerId : over.id;
        const targetList = listFromId(targetId);
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
              order: components.findIndex(p => p.id === over.id) + 1,
            },
          );
        } else if (startingList === ComponentType.unused && targetList === ComponentType.selected) {
          // move from unused to selected
          announce = formatMessage(
            { id: 'ld.profileSettings.announce.movedToSelected' },
            {
              name: activeComponent.name,
              order: components.findIndex(p => p.id === over.id) + 1,
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
