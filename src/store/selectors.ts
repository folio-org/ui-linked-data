import { createSelectors } from './utils/selectors';
import { useStatusStore } from './status';
import { useLoadingStateStore } from './loadingState';
import { useMarcPreviewStore } from './marcPreview';
import { useProfileStore } from './profile';
import { useInputsStore } from './inputs';
import { useConfigStore } from './config';

export const useStatusState = () => createSelectors(useStatusStore).use;
export const useLoadingState = () => createSelectors(useLoadingStateStore).use;
export const useMarcPreviewState = () => createSelectors(useMarcPreviewStore).use;
export const useProfileState = () => createSelectors(useProfileStore).use;
export const useInputsState = () => createSelectors(useInputsStore).use;
export const useConfigState = () => createSelectors(useConfigStore).use;
