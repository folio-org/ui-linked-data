import { StateCreator } from 'zustand';

type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

export type SliceState<K extends string, V, T = V> = {
  [P in K]: V;
} & {
  [P in `set${Capitalize<K>}`]: (value: V) => void;
} & {
  [P in `reset${Capitalize<K>}`]: () => void;
} & {
  [P in `add${Capitalize<K>}`]: (value: T) => void;
};

export const createBaseSlice = <K extends string, V, T = V>(
  valueTitle: K,
  initialValue: V,
  sliceTitle: string,
): StateCreator<SliceState<K, V, T>, [['zustand/devtools', never]], [], SliceState<K, V, T>> => {
  return set => {
    const capitalizedTitle = capitalize(valueTitle);

    return {
      [valueTitle]: initialValue,
      [`set${capitalizedTitle}`]: (updatedValue: V) =>
        set({ [valueTitle]: updatedValue } as any, undefined, `${sliceTitle}/set${capitalizedTitle}`),
      [`reset${capitalizedTitle}`]: () =>
        set({ [valueTitle]: initialValue } as any, undefined, `${sliceTitle}/set${capitalizedTitle}`),
      [`add${capitalizedTitle}`]: (updatedValue: T) =>
        set(
          state => {
            const value = state[valueTitle] as any;

            if (Array.isArray(value)) {
              return { [valueTitle]: [...value, updatedValue] } as any;
            } else if (typeof value === 'object' && value !== null) {
              if (typeof updatedValue === 'object' && updatedValue !== null) {
                return { [valueTitle]: { ...value, ...updatedValue } } as any;
              }

              return { [valueTitle]: updatedValue } as any;
            } else if (value instanceof Set) {
              return { [valueTitle]: new Set([...value, updatedValue]) } as any;
            } else if (typeof value === 'string') {
              return { [valueTitle]: `${value}${updatedValue}` } as any;
            }

            return { [valueTitle]: updatedValue } as any;
          },
          undefined,
          `${sliceTitle}/set${capitalizedTitle}`,
        ),
    } as SliceState<K, V, T>;
  };
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
