import { useStatusStore } from './stores/status';
import { useLoadingStateStore } from './stores/loadingState';
import { useMarcPreviewStore } from './stores/marcPreview';
import { useProfileStore } from './stores/profile';
import { useInputsStore } from './stores/inputs';
import { useConfigStore } from './stores/config';
import { useUIStore } from './stores/ui';
import { useSearchStore } from './stores/search';

// "createSelectors" can be used here for generation of the memoized selectors.
// Now this function is non-optimized and its usage causes memory leaks.
export const useStatusState = useStatusStore;
export const useLoadingState = useLoadingStateStore;
export const useMarcPreviewState = useMarcPreviewStore;
export const useProfileState = useProfileStore;
export const useInputsState = useInputsStore;
export const useConfigState = useConfigStore;
export const useUIState = useUIStore;
export const useSearchState = useSearchStore;
