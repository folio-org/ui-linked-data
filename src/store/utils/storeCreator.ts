import { IS_PROD_MODE } from '@common/constants/bundle.constants';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

const STORE_NAME = 'Linked Data Editor';

export const generateStore = <T>(store: StateCreator<T, [['zustand/devtools', never]], []>, name: string) =>
  create<T>()(devtools(store, { name: STORE_NAME, store: name, enabled: !IS_PROD_MODE }));
