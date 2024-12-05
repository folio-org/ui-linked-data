import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore, type StateCreatorTyped } from './utils/storeCreator';

export type LoadingState = SliceState<'isLoading', boolean>;

const STORE_NAME = 'Loading';

const loadingStateStore: StateCreatorTyped<LoadingState> = (...args) => ({
  ...createBaseSlice({ basic: 'isLoading' }, false)(...args),
});

export const useLoadingStateStore = generateStore(loadingStateStore, STORE_NAME);
