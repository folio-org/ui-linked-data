import { StateCreator } from 'zustand';
import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore } from './utils/storeCreator';

export type LoadingState = SliceState<'isLoading', boolean>;

const STORE_NAME = 'Loading';

const loadingStateStore: StateCreator<LoadingState, [['zustand/devtools', never]], []> = (...args) => ({
  ...createBaseSlice({ basic: 'isLoading' }, false)(...args),
});

export const useLoadingStateStore = generateStore(loadingStateStore, STORE_NAME);
