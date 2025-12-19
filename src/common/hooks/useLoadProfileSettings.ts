import { useQueryClient } from '@tanstack/react-query';
import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { fetchProfileSettings } from '@/common/api/profiles.api';
import { detectDrift } from '@/common/helpers/profileSettingsDrift.helper';
import { useStatusState } from '@/store';
import { logger } from '@/common/services/logger';

export const useLoadProfileSettings = () => {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const queryClient = useQueryClient();

  const sortProfileSettingsChildren = (settings: ProfileSettings) => {
    settings.children?.sort((a, b) => {
      if (a.visible && !b.visible) {
        return -1;
      } else if (!a.visible && b.visible) {
        return 1;
      } else if (!a.visible && !b.visible) {
        return 0;
      } else if (a.order !== undefined && b.order === undefined) {
        // .order shouldn't be undefined if both are visible,
        // but handle those cases anyways.
        return -1;
      } else if (a.order === undefined && b.order !== undefined) {
        return 1;
      } else if (a.order === undefined && b.order === undefined) {
        return 0;
      } else {
        return a.order! - b.order!;
      }
    });
  };

  const loadProfileSettings = async (profileId: string | number | undefined, profile: Profile) => {
    const queryKey = ['profileSettings', profileId];
    const queryFn = async () => {
      if (profileId === undefined) {
        return DEFAULT_INACTIVE_SETTINGS;
      }
      const settings = await fetchProfileSettings(profileId);
      sortProfileSettingsChildren(settings);
      return detectDrift(profile, settings);
    };

    try {
      const settings = await queryClient.ensureQueryData({
        queryKey,
        queryFn,
        staleTime: Infinity,
      });
      return settings;
    } catch (error) {
      logger.error('Error fetching profile settings:', error);
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadProfileSettings'));
      return DEFAULT_INACTIVE_SETTINGS;
    }
  };

  return {
    loadProfileSettings,
  };
};
