import { useMutation } from '@tanstack/react-query';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { StatusType } from '@/common/constants/status.constants';
import { getFriendlyErrorMessage } from '@/common/helpers/api.helper';
import { generateEditResourceUrl } from '@/common/helpers/navigation.helper';
import { getRecordId } from '@/common/helpers/record.helper';
import { useNavigateToEditPage } from '@/common/hooks/useNavigateToEditPage';
import { UserNotificationFactory } from '@/common/services/userNotification';

import { useLoadingState, useStatusState } from '@/store';

import { buildHubUri, importHub } from '../api/hubImport.api';

interface ImportHubParams {
  hubId: string;
  source?: string;
}

export const useHubImportMutation = () => {
  const { setIsLoading } = useLoadingState(['setIsLoading']);
  const { addStatusMessagesItem } = useStatusState(['addStatusMessagesItem']);
  const { navigateToEditPage } = useNavigateToEditPage();

  const mutation = useMutation<RecordEntry, Error, ImportHubParams>({
    mutationFn: async ({ hubId, source }) => {
      const hubUri = buildHubUri(hubId, source);

      return importHub({ hubUri });
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: record => {
      const id = getRecordId(record, TYPE_URIS.HUB);

      if (id) {
        navigateToEditPage(generateEditResourceUrl(id), { replace: true });
      }
    },
    onError: err => {
      addStatusMessagesItem?.(UserNotificationFactory.createMessage(StatusType.error, getFriendlyErrorMessage(err)));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const importHubForEdit = async (hubId: string, source?: string) => {
    if (!hubId) return;

    await mutation.mutateAsync({ hubId, source });
  };

  return {
    importHubForEdit,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
