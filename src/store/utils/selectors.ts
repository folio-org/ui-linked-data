import type { StoreApi, UseBoundStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

export type Result<State extends object, Key extends readonly (keyof State)[]> = Pick<State, Key[number]>;

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

export function enhanceBoundStore<T extends object>(base: UseBoundStore<StoreApi<T>>): EnhancedBoundStore<T> {
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
