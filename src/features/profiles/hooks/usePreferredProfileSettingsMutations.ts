import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePreferredProfileSettings, savePreferredProfileSettings } from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';
import { logger } from '@/common/services/logger';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useStatusState } from '@/store';

export interface SavePreferredProfileSettingsParams {
  profileId: string | number;
  profileSettingsId: number;
}

export interface DeletePreferredProfileSettingsParams {
  profileId: string | number;
}

export const usePreferredProfileSettingsMutations = () => {
  const queryClient = useQueryClient();
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);

  const updateMutation = useMutation<Response, Error, SavePreferredProfileSettingsParams>({
    mutationFn: async ({ profileId, profileSettingsId }) => {
      return savePreferredProfileSettings(profileId, profileSettingsId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['preferredProfileSettings', String(variables.profileId)],
      });
    },
    onError: error => {
      logger.error('Failed to save preferred profile settings', error);
      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.error.updatePreferredProfileSettings'),
      );
    },
  });

  const deleteMutation = useMutation<Response, Error, DeletePreferredProfileSettingsParams>({
    mutationFn: async ({ profileId }) => {
      return deletePreferredProfileSettings(profileId);
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(['preferredProfileSettings', String(variables.profileId)], []);
    },
    onError: error => {
      logger.error('Failed to delete preferred profile settings', error);
      addStatusMessagesItem?.(
        UserNotificationFactory.createMessage(StatusType.error, 'ld.error.updatePreferredProfileSettings'),
      );
    },
  });

  const updatePreferredProfileSettings = (params: SavePreferredProfileSettingsParams) => {
    return updateMutation.mutate(params);
  };

  const removePreferredProfileSettings = (params: DeletePreferredProfileSettingsParams) => {
    return deleteMutation.mutate(params);
  };

  return {
    updatePreferredProfileSettings,
    removePreferredProfileSettings,
  };
};
