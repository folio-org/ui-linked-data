import { StateCreator } from 'zustand';

type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

export type SliceState<K extends string, V, T = V> = {
  [P in K]: V;
} & {
  [P in `set${Capitalize<K>}`]: (value: V) => void;
} & {
  [P in `reset${Capitalize<K>}`]: () => void;
} & Partial<{
    [P in `add${Capitalize<K>}`]: (value: T) => void;
  }>;

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const updateValue = <V, T>(value: V, updatedValue: T): V => {
  if (Array.isArray(value)) {
    return [...value, updatedValue] as any;
  } else if (value instanceof Map) {
    const newMap = new Map(value);

    if (updatedValue instanceof Map) {
      updatedValue.forEach((value, key) => newMap.set(key, value));
    } else if (typeof updatedValue === 'object' && updatedValue !== null) {
      Object.entries(updatedValue).forEach(([k, v]) => newMap.set(k, v));
    }

    return newMap as any;
  } else if (typeof value === 'object' && value !== null) {
    if (typeof updatedValue === 'object' && updatedValue !== null) {
      return { ...value, ...updatedValue } as any;
    }

    return updatedValue as any;
  } else if (value instanceof Set) {
    return new Set([...value, updatedValue]) as any;
  } else if (typeof value === 'string') {
    return `${value}${updatedValue}` as any;
  }

  return updatedValue as any;
};

export const createBaseSlice = <K extends string, V, T = V>(
  valueTitle: K,
  initialValue: V,
  sliceTitle: string,
  canAddSingleItem = false,
): StateCreator<SliceState<K, V, T>, [['zustand/devtools', never]], [], SliceState<K, V, T>> => {
  return set => {
    const capitalizedTitle = capitalize(valueTitle);

    const baseSlice = {
      [valueTitle]: initialValue,
      [`set${capitalizedTitle}`]: (updatedValue: V) =>
        set({ [valueTitle]: updatedValue } as any, false, `${sliceTitle}/set${capitalizedTitle}`),
      [`reset${capitalizedTitle}`]: () =>
        set({ [valueTitle]: initialValue } as any, false, `${sliceTitle}/reset${capitalizedTitle}`),
    } as SliceState<K, V, T>;

    if (canAddSingleItem) {
      (baseSlice as any)[`add${capitalizedTitle}`] = (updatedValue: T) =>
        set(
          state => {
            const value = state[valueTitle] as any;
            return { [valueTitle]: updateValue(value, updatedValue) } as any;
          },
          false,
          `${sliceTitle}/add${capitalizedTitle}`,
        );
    }

    return baseSlice;
  };
};
