import { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends {
  getState: () => infer T;
}
  ? S & { use: { [K in keyof T]: T[K] } }
  : never;

// Use this function to generate all available selectors
// Currently, invoking it after each re-render leads to memory leaks, so it should be memoized to prevent this issue
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};

  for (const key of Object.keys(store.getState())) {
    (store.use as any)[key] = store(selector => selector[key as keyof typeof selector]);
  }

  return store;
};
