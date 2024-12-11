import { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends {
  getState: () => infer T;
}
  ? S & { use: { [K in keyof T]: T[K] } }
  : never;

// Use this function to generate all available selectors.
// Now it causes memory leaks if invoke it after each re-render, so it should be memoized. 
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};

  for (const key of Object.keys(store.getState())) {
    (store.use as any)[key] = store(selector => selector[key as keyof typeof selector]);
  }

  return store;
};
