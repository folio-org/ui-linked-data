import { StateCreator } from 'zustand';

type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

export type SliceState<K extends string, V> = {
  [P in K]: V;
} & {
  [P in `set${Capitalize<K>}`]: (value: V) => void;
} & {
  [P in `reset${Capitalize<K>}`]: () => void;
};

export const createBaseSlice = <K extends string, V>(
  valueTitle: K,
  initialValue: V,
  sliceTitle: string,
): StateCreator<SliceState<K, V>, [['zustand/devtools', never]], [], SliceState<K, V>> => {
  return set => {
    const capitalizedTitle = capitalize(valueTitle);

    return {
      [valueTitle]: initialValue,
      [`set${capitalizedTitle}`]: (updatedValue: V) =>
        set({ [valueTitle]: updatedValue } as any, undefined, `${sliceTitle}/set${capitalizedTitle}`),
      [`reset${capitalizedTitle}`]: () =>
        set({ [valueTitle]: initialValue } as any, undefined, `${sliceTitle}/set${capitalizedTitle}`),
    } as SliceState<K, V>;
  };
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
