import { createSelectors } from './utils/selectors';
import { useStatusStore } from './stores/status';
import { useLoadingStateStore } from './stores/loadingState';
import { useMarcPreviewStore } from './stores/marcPreview';
import { useProfileStore } from './stores/profile';
import { useInputsStore } from './stores/inputs';
import { useConfigStore } from './stores/config';
import { useUIStore } from './stores/ui';
import { useSearchStore } from './stores/search';

export const useStatusState = () => createSelectors(useStatusStore).use;
export const useLoadingState = () => createSelectors(useLoadingStateStore).use;
export const useMarcPreviewState = () => createSelectors(useMarcPreviewStore).use;
export const useProfileState = () => createSelectors(useProfileStore).use;
export const useInputsState = () => createSelectors(useInputsStore).use;
export const useConfigState = () => createSelectors(useConfigStore).use;
export const useUIState = () => createSelectors(useUIStore).use;
export const useSearchState = () => createSelectors(useSearchStore).use;
