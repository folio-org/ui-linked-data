import { createSelectors } from './utils/selectors';
import { useStatusStore } from './status';
import { useMarcPreviewStore } from './marcPreview';

export const useStatusState = () => createSelectors(useStatusStore).use;
export const useMarcPreviewState = () => createSelectors(useMarcPreviewStore).use;
