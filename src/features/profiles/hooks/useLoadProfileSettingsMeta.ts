import { useQuery } from '@tanstack/react-query';

import { fetchAllSettingsForProfile } from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

export const useLoadProfileSettingsMeta = (profileId: string | number | null) => {
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const result = useQuery<ProfileSettingsMetaList>({
    queryKey: ['profileSettingsMeta', String(profileId)],
    queryFn: async () => {
      return fetchAllSettingsForProfile(profileId!);
    },
    staleTime: Infinity,
    enabled: !!profileId,
  });
  if (result.error) {
    logger.error('Error fetching profile settings metadata', result.error);
    addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, 'ld.cantLoadProfileSettings'));
  }
  return result;
};
