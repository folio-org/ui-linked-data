import { useMutation } from '@tanstack/react-query';

import { importHub, normalizeExternalHubUri } from '@/common/api/hub.api';
import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getFriendlyErrorMessage } from '@/common/helpers/api.helper';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { getRecordId } from '@/common/helpers/record.helper';
import { useNavigateWithSearchState } from '@/common/hooks/useNavigateWithSearchState';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useStatusState } from '@/store';

interface ImportHubParams {
  hubUri: string;
}

export const useHubImportMutation = () => {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { navigateWithState } = useNavigateWithSearchState();

  const mutation = useMutation<RecordEntry, Error, ImportHubParams>({
    mutationFn: async ({ hubUri }) => {
      const normalizedUri = normalizeExternalHubUri(hubUri);

      return importHub({ hubUri: normalizedUri });
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: record => {
      const id = getRecordId(record, TYPE_URIS.HUB);

      if (id) {
        navigateWithState(generateEditResourceUrl(id), { replace: true });
      }
    },
    onError: err => {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, getFriendlyErrorMessage(err)));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const importHubForEdit = async (hubUri: string) => {
    if (!hubUri) return;

    await mutation.mutateAsync({ hubUri });
  };

  return {
    importHubForEdit,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
