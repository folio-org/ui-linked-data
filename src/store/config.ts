import { LOCALES } from '@common/i18n/locales';
import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore, type StateCreatorTyped } from './utils/storeCreator';
import { OKAPI_CONFIG } from '@common/constants/api.constants';
import { localStorageService } from '@common/services/storage';

type Locale = (typeof LOCALES)[keyof typeof LOCALES];
type CustomEvents = Record<string, string> | null;

export type ConfigState = SliceState<'locale', Locale> &
  SliceState<'customEvents', CustomEvents> &
  SliceState<'hasNavigationOrigin', boolean>;

const STORE_NAME = 'Config';

const configStore: StateCreatorTyped<ConfigState> = (...args) => ({
  ...createBaseSlice(
    { basic: 'locale' },
    localStorageService.deserialize(OKAPI_CONFIG)?.locale || LOCALES.ENGLISH_US,
  )(...args),
  ...createBaseSlice({ basic: 'customEvents' }, null as CustomEvents)(...args),
  ...createBaseSlice({ basic: 'hasNavigationOrigin' }, false)(...args),
});

export const useConfigStore = generateStore(configStore, STORE_NAME);
