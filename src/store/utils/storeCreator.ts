import { create as actualCreate, type StateCreator, type StoreApi, type UseBoundStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { devtools } from 'zustand/middleware';
import { IS_PROD_MODE } from '@common/constants/bundle.constants';

const STORE_NAME = 'Linked Data Editor';

export const storeResetFunctions = new Set<() => void>();

export type WithDevtools<T> = ReturnType<typeof devtools<T>>;

export type StateCreatorTyped<T> = StateCreator<T, [['zustand/devtools', never]], []>;

type Result<State extends object, Key extends readonly (keyof State)[]> = Pick<State, Key[number]>;

// Helper to pick a subset of keys from the state (used for array-of-keys selection)
function pick<T extends object, K extends readonly (keyof T)[]>(state: T, keys: K): Result<T, K> {
  const result = {} as Result<T, K>;

  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result as any)[key] = state[key];
  }

  return result;
}

/*
 * Enhance a bound store hook with ergonomic overloads:
 *  - () => full state (existing behavior, discouraged for components);
 *  - (keys: readonly (keyof T)[]) => Pick<T, K[number]> with shallow comparison;
 *  - (selector: (s: T) => U) => U with implicit shallow when selector returns an object.
 * Implemented via `useShallow` wrapper from zustand v5
 */
type EnhancedBoundStore<T extends object> = (((...args: []) => T) &
  (<K extends readonly (keyof T)[]>(keys: K) => Result<T, K>) &
  (<U>(selector: (state: T) => U) => U)) &
  UseBoundStore<StoreApi<T>>;

function enhanceBoundStore<T extends object>(base: UseBoundStore<StoreApi<T>>): EnhancedBoundStore<T> {
  // Wrapper that adds new invocation forms
  function useEnhancedStore(): T;
  function useEnhancedStore<K extends readonly (keyof T)[]>(keys: K): Result<T, K>;
  function useEnhancedStore<U>(selector: (state: T) => U): U;
  function useEnhancedStore(arg?: unknown): unknown {
    // Derive a selector function based on invocation form, then always call base(useShallow(selector))
    let selector: (s: T) => unknown;

    if (Array.isArray(arg)) {
      const keys = arg as readonly (keyof T)[];

      selector = (s: T) => pick(s, keys);
    } else if (typeof arg === 'function') {
      selector = arg as (s: T) => unknown;
    } else {
      selector = (s: T) => s;
    }

    return base(useShallow(selector));
  }

  // Preserve the original store API surface (getState, setState, subscribe, etc.)
  return Object.assign(useEnhancedStore, base) as unknown as EnhancedBoundStore<T>;
}

export const create = (<T>() =>
  (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    const initialState = store.getInitialState();

    storeResetFunctions.add(() => {
      store.setState(initialState, true);
    });

    return store;
  }) as typeof actualCreate;

export const generateStore = <T extends object>(store: StateCreatorTyped<T>, name: string) => {
  const base = create<T>()(devtools(store, { name: STORE_NAME, store: name, enabled: !IS_PROD_MODE }));

  return enhanceBoundStore<T>(base as unknown as UseBoundStore<StoreApi<T>>);
};

export const resetAllStores = () => {
  storeResetFunctions.forEach(reset => {
    reset();
  });
};
