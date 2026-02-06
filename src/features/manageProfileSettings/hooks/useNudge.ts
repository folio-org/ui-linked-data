import { Dispatch, SetStateAction } from 'react';
import { useIntl } from 'react-intl';

import { useAnnouncement } from '@dnd-kit/accessibility';
import { arrayMove } from '@dnd-kit/sortable';

import { useManageProfileSettingsState } from '@/store';

interface UseNudgeParams {
  setSelected: Dispatch<SetStateAction<ProfileSettingComponent[]>>;
}

export const useNudge = ({ setSelected }: UseNudgeParams) => {
  const { formatMessage } = useIntl();
  const { announce } = useAnnouncement();
  const { setIsModified } = useManageProfileSettingsState(['setIsModified']);

  const makeMove = (index: number, increment: number, name: string) => {
    return () => {
      setIsModified(true);
      setSelected(prev => {
        announce(
          formatMessage(
            { id: 'ld.profileSettings.announce.reorderedSelected' },
            {
              name: name,
              order: index + increment,
            },
          ),
        );
        return arrayMove(prev, index, index + increment);
      });
    };
  };

  const makeMoveUp = (index: number, name: string) => {
    return makeMove(index, -1, name);
  };

  const makeMoveDown = (index: number, name: string) => {
    return makeMove(index, 1, name);
  };

  return {
    makeMoveUp,
    makeMoveDown,
  };
};
