import { QueryParams } from '@/common/constants/routes.constants';

import { SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type NavigationState = SliceState<'queryParams', Record<(typeof QueryParams)[keyof typeof QueryParams], string>>;

const STORE_NAME = 'Navigation';

const sliceConfigs: SliceConfigs = {
  queryParams: {
    initialValue: null,
  },
};

export const useNavigationStore = createStoreFactory<NavigationState, SliceConfigs>(sliceConfigs, STORE_NAME);
