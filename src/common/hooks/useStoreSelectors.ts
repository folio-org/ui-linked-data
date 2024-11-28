import { useMarcPreviewStore as useMarcPreviewStoreBase } from '@src/store/marcPreview';
import { useStatusStore as useStatusStoreBase } from '@src/store/status';
import { createSelectors } from '@src/store/utils/selectors';

export const useStoreSelector = () => {
  return {
    marcPreview: createSelectors(useMarcPreviewStoreBase).use,
    status: createSelectors(useStatusStoreBase).use,
  };
};
