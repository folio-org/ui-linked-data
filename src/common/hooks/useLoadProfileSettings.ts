import { useQueryClient } from '@tanstack/react-query';
import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';
import { StatusType } from '@/common/constants/status.constants';
import { UserNotificationFactory } from '@/common/services/userNotification';
import { fetchProfileSettings } from '@/common/api/profiles.api';
import { sortProfileSettingsChildren } from '@/common/helpers/profileSettingsSort.helper';
import { detectDrift } from '@/common/helpers/profileSettingsDrift.helper';
import { useStatusState } from '@/store';
import { logger } from '@/common/services/logger';

export const useLoadProfileSettings = () => {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const queryClient = useQueryClient();

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
