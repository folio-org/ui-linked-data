import { StateCreator } from 'zustand';

type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

export type SliceState<K extends string, V, T = V> = {
  [P in K]: V;
} & {
  [P in `set${Capitalize<K>}`]: (value: V | SetState<V>) => void;
} & {
  [P in `reset${Capitalize<K>}`]: () => void;
} & Partial<{
    [P in `add${Capitalize<K>}Item`]: (value: T) => void;
  }>;

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const updateValue = <V, T>(value: V, updatedValue: T): V => {
  if (Array.isArray(value)) {
    return [...value, updatedValue] as V;
  } else if (value instanceof Map) {
    const newMap = new Map(value);

    if (updatedValue instanceof Map) {
      updatedValue.forEach((value, key) => newMap.set(key, value));
    } else if (typeof updatedValue === 'object' && updatedValue !== null) {
      Object.entries(updatedValue).forEach(([key, value]) => newMap.set(key, value));
    }

    return newMap as V;
  } else if (value instanceof Set) {
    return new Set([...value, updatedValue]) as V;
  } else if (typeof value === 'object' && value !== null) {
    if (typeof updatedValue === 'object' && updatedValue !== null) {
      return { ...value, ...updatedValue } as any;
    }

    return updatedValue as any;
  } else if (typeof value === 'string') {
    return `${value}${updatedValue}` as any;
  }

  return updatedValue as any;
};

export const createBaseSlice = <K extends string, V, T = V>(
  keys: { basic: K },
  initialValue: V,
  canAddSingleItem = false,
): StateCreator<SliceState<K, V, T>, [['zustand/devtools', never]], [], SliceState<K, V, T>> => {
  return set => {
    const capitalizedTitle = capitalize(keys.basic);

    const baseSlice = {
      [keys.basic]: initialValue,
      [`set${capitalizedTitle}`]: (updatedValue: V | SetState<V>) =>
        set(
          state =>
            ({
              [keys.basic]:
                typeof updatedValue === 'function' ? (updatedValue as SetState<V>)(state[keys.basic]) : updatedValue,
            }) as any,
          false,
          `set${capitalizedTitle}`,
        ),
      [`reset${capitalizedTitle}`]: () => set({ [keys.basic]: initialValue } as any, false, `reset${capitalizedTitle}`),
    } as SliceState<K, V, T>;

    if (canAddSingleItem) {
      (baseSlice as any)[`add${capitalize(keys.basic)}Item`] = (updatedValue: T) =>
        set(
          state => {
            const value = state[keys.basic] as any;

            return { [keys.basic]: updateValue(value, updatedValue) } as any;
          },
          false,
          `add${capitalizedTitle}Item`,
        );
    }

    return baseSlice;
  };
};
