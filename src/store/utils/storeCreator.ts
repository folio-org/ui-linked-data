import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IS_PROD_MODE } from '@common/constants/bundle.constants';

const STORE_NAME = 'Linked Data Editor';

export type WithDevtools<T> = ReturnType<typeof devtools<T>>;

export type StateCreatorTyped<T> = StateCreator<T, [['zustand/devtools', never]], []>;

export const generateStore = <T>(store: StateCreatorTyped<T>, name: string) =>
  create<T>()(devtools(store, { name: STORE_NAME, store: name, enabled: !IS_PROD_MODE }));
