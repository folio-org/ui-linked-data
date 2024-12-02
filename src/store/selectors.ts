import { createSelectors } from './utils/selectors';
import { useStatusStore } from './status';
import { useLoadingStateStore } from './loadingState';
import { useMarcPreviewStore } from './marcPreview';

export const useStatusState = () => createSelectors(useStatusStore).use;
export const useLoadingState = () => createSelectors(useLoadingStateStore).use;
export const useMarcPreviewState = () => createSelectors(useMarcPreviewStore).use;
