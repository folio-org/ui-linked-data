import { useResourcePreviewQuery } from '@/features/resources';

export const useEditPreview = (linkedEntityId?: string) => {
  const { data, isLoading, isError } = useResourcePreviewQuery(linkedEntityId, 'edit-link');

  return {
    altSchema: data?.schema,
    altUserValues: data?.userValues,
    altInitKey: data?.initKey,
    title: data?.title,
    isLoading,
    isError,
  };
};
