import { useResourcePreviewQuery } from '@/features/resources';

export const useEditPreview = (linkedEntityId?: string) => {
  const { data, isLoading, isError } = useResourcePreviewQuery(linkedEntityId, 'edit-link');

  return { data, isLoading, isError };
};
