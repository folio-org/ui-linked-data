import { createSelectors } from './utils/selectors';
import { useMarcPreviewStoreBase } from './marcPreview';
import { useStatusStoreBase } from './status';

export const useMarcPreviewStore = () => createSelectors(useMarcPreviewStoreBase).use;
export const useStatusStore = () => createSelectors(useStatusStoreBase).use;
