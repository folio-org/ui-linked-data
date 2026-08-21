import { type SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type LoadingState = SliceState<'isLoading', boolean> & SliceState<'isPreviewLoading', boolean>;

const STORE_NAME = 'Loading';

const sliceConfigs: SliceConfigs = {
  isLoading: {
    initialValue: false,
  },
  isPreviewLoading: {
    initialValue: false,
  },
};

export const useLoadingStateStore = createStoreFactory<LoadingState, SliceConfigs>(sliceConfigs, STORE_NAME);
