import { useQueryClient } from '@tanstack/react-query';

import { fetchProfileSettings } from '@/common/api/profiles.api';
import {
  DEFAULT_INACTIVE_SETTINGS,
  PROFILE_SETTINGS_DEFAULT_OPTION,
} from '@/common/constants/profileSettings.constants';
import { StatusType } from '@/common/constants/status.constants';
import { detectDrift } from '@/common/helpers/profileSettingsDrift.helper';
import { sortProfileSettingsChildren } from '@/common/helpers/profileSettingsSort.helper';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

export const useLoadProfileSettings = () => {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const queryClient = useQueryClient();

  const loadProfileSettings = async (
    profileSettingsId: string | number,
    profileId: string | number | undefined,
    profile: Profile,
    resourceTypeURL?: string,
  ) => {
    if (profileId === undefined || profileSettingsId === PROFILE_SETTINGS_DEFAULT_OPTION) {
      return DEFAULT_INACTIVE_SETTINGS;
    }

    try {
      const settings = await queryClient.ensureQueryData({
        queryKey: ['profileSettings', String(profileId), profileSettingsId],
        queryFn: async () => {
          const loadedSettings = await fetchProfileSettings(profileId, profileSettingsId);
          sortProfileSettingsChildren(loadedSettings);

          return loadedSettings;
        },
        staleTime: Infinity,
      });

      return detectDrift(profile, settings, resourceTypeURL);
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
