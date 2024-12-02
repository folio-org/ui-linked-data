import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IS_PROD_MODE } from '@common/constants/bundle.constants';
import { createBaseSlice, SliceState } from './utils/slice';

export type LoadingState = SliceState<'isLoading', boolean>;

const STORE_NAME = 'LoadingState';

export const useLoadingStateStore = create<LoadingState>()(
  devtools(
    (...args) => ({
      ...createBaseSlice({ basic: 'isLoading' }, false)(...args),
    }),
    { name: 'Linked Data Editor', store: STORE_NAME, enabled: !IS_PROD_MODE },
  ),
);
