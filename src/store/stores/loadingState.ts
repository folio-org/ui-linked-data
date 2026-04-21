import { type SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type LoadingState = SliceState<'isLoading', boolean>;

const STORE_NAME = 'Loading';

const sliceConfigs: SliceConfigs = {
  isLoading: {
    initialValue: false,
  },
};

export const useLoadingStateStore = createStoreFactory<LoadingState, SliceConfigs>(sliceConfigs, STORE_NAME);
