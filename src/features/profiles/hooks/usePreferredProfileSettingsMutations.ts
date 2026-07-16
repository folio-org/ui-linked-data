import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePreferredProfileSettings, savePreferredProfileSettings } from '@/common/api/profiles.api';

export interface SavePreferredProfileSettingsParams {
  profileId: string | number;
  profileSettingsId: number;
}

export interface DeletePreferredProfileSettingsParams {
  profileId: string | number;
}

export const usePreferredProfileSettingsMutations = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation<Response, Error, SavePreferredProfileSettingsParams>({
    mutationFn: async ({ profileId, profileSettingsId }) => {
      return savePreferredProfileSettings(profileId, profileSettingsId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['preferredProfileSettings', String(variables.profileId)],
      });
    },
    onError: () => {
      // handle error
    },
  });

  const deleteMutation = useMutation<Response, Error, DeletePreferredProfileSettingsParams>({
    mutationFn: async ({ profileId }) => {
      return deletePreferredProfileSettings(profileId);
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(['preferredProfileSettings', String(variables.profileId)], []);
    },
    onError: () => {
      // TODO handle error
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
