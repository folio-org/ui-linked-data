import { useStatusStore } from './stores/status';
import { useLoadingStateStore } from './stores/loadingState';
import { useMarcPreviewStore } from './stores/marcPreview';
import { useProfileStore } from './stores/profile';
import { useInputsStore } from './stores/inputs';
import { useConfigStore } from './stores/config';
import { useUIStore } from './stores/ui';
import { useSearchStore } from './stores/search';
import { useComplexLookupStore } from './stores/complexLookup';

// The "createSelectors" function can be utilized here to generate memoized selectors
// Note: "createSelectors" is currently unoptimized and may result in memory leaks if used as is
export const useStatusState = useStatusStore;
export const useLoadingState = useLoadingStateStore;
export const useMarcPreviewState = useMarcPreviewStore;
export const useProfileState = useProfileStore;
export const useInputsState = useInputsStore;
export const useConfigState = useConfigStore;
export const useUIState = useUIStore;
export const useSearchState = useSearchStore;
export const useComplexLookup = useComplexLookupStore;
