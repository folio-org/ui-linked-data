import { useMutation } from '@tanstack/react-query';

import { importHub, normalizeExternalHubUri } from '@/common/api/hub.api';
import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { getRecordId } from '@/common/helpers/record.helper';

interface ImportForAssignmentParams {
  hubUri: string;
}

interface ImportForAssignmentResult {
  importedId: string;
}

/**
 * React-query mutation for importing a hub during assignment.
 * Calls POST /linked-data/hub and extracts the generated id.
 */
export const useHubImportAssignmentMutation = () => {
  const mutation = useMutation<ImportForAssignmentResult, Error, ImportForAssignmentParams>({
    mutationFn: async ({ hubUri }) => {
      const normalizedUri = normalizeExternalHubUri(hubUri);
      const record = await importHub({ hubUri: normalizedUri });
      const importedId = getRecordId(record, TYPE_URIS.HUB);

      if (!importedId) {
        throw new Error('Hub import returned no id');
      }

      return { importedId };
    },
  });

  return {
    importForAssignment: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};
