import { create as actualCreate, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IS_PROD_MODE } from '@common/constants/bundle.constants';

const STORE_NAME = 'Linked Data Editor';

export const storeResetFunctions = new Set<() => void>();

export type WithDevtools<T> = ReturnType<typeof devtools<T>>;

export type StateCreatorTyped<T> = StateCreator<T, [['zustand/devtools', never]], []>;

export const create = (<T>() =>
  (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    const initialState = store.getInitialState();

    storeResetFunctions.add(() => {
      store.setState(initialState, true);
    });

    return store;
  }) as typeof actualCreate;

export const generateStore = <T extends object>(store: StateCreatorTyped<T>, name: string) =>
  create<T>()(devtools(store, { name: STORE_NAME, store: name, enabled: !IS_PROD_MODE }));

export const resetAllStores = () => {
  storeResetFunctions.forEach(reset => {
    reset();
  });
};
