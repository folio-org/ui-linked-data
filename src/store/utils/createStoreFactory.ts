import { createBaseSlice, type SliceState } from '../utils/slice';
import { generateStore, type StateCreatorTyped } from './storeCreator';

type SliceConfig<Value = any, SingleItemType = any> = {
  initialValue: Value;
  singleItem?: {
    type: SingleItemType;
  };
  canAddSingleItem?: boolean;
};

export type SliceConfigs = Record<string, SliceConfig>;

type InferSliceState<T extends SliceConfigs> = {
  [K in keyof T]: T[K] extends SliceConfig<infer V, infer S>
    ? T[K]['singleItem'] extends { type: any }
      ? SliceState<K & string, V, S>
      : SliceState<K & string, V>
    : never;
}[keyof T];

export function createStoreFactory<U, T extends SliceConfigs>(configs: T, storeName: string) {
  type State = InferSliceState<T>;

  const storeCreator: StateCreatorTyped<State> = (set, get, api) =>
    Object.entries(configs).reduce(
      (acc, [key, { initialValue, canAddSingleItem }]) => ({
        ...acc,
        ...createBaseSlice(
          {
            basic: key as keyof T & string,
          },
          initialValue,
          canAddSingleItem,
        )(set as any, get as any, api as any),
      }),
      {} as State,
    );

  return generateStore<U>(storeCreator as StateCreatorTyped<U>, storeName);
}
