import { createBaseSlice, type SliceState } from './slice';
import { generateStore, type StateCreatorTyped } from './storeCreator';

type SliceConfig<Value = unknown, SingleItemType = unknown> = {
  initialValue: Value;
  singleItem?: {
    type: SingleItemType;
  };
};

export type SliceConfigs = Record<string, SliceConfig>;

type InferSliceState<T extends SliceConfigs> = {
  [K in keyof T]: T[K] extends SliceConfig<infer V, infer S>
    ? T[K]['singleItem'] extends { type: any }
      ? SliceState<K & string, V, S>
      : SliceState<K & string, V>
    : never;
}[keyof T];

export function createStoreFactory<U extends object, T extends SliceConfigs>(configs: T, storeName: string) {
  type State = InferSliceState<T>;

  const storeCreator: StateCreatorTyped<State> = (set, get, api) =>
    Object.entries(configs).reduce(
      (acc, [key, { initialValue, singleItem }]) => ({
        ...acc,
        ...createBaseSlice(
          {
            basic: key as keyof T & string,
          },
          initialValue,
          !!singleItem,
        )(set, get, api),
      }),
      {} as State,
    );

  return generateStore<U>(storeCreator as unknown as StateCreatorTyped<U>, storeName);
}
