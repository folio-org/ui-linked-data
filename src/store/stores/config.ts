import { OKAPI_CONFIG } from '@/common/constants/api.constants';
import { LOCALES } from '@/common/i18n/locales';
import { localStorageService } from '@/common/services/storage';

import { type SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type Locale = (typeof LOCALES)[keyof typeof LOCALES];
type CustomEvents = Record<string, string> | null;

export type ConfigState = SliceState<'locale', Locale> &
  SliceState<'customEvents', CustomEvents> &
  SliceState<'hasNavigationOrigin', boolean>;

const STORE_NAME = 'Config';

const sliceConfigs: SliceConfigs = {
  locale: {
    initialValue: localStorageService.deserialize(OKAPI_CONFIG)?.locale || LOCALES.ENGLISH_US,
  },
  customEvents: {
    initialValue: null as CustomEvents,
  },
  hasNavigationOrigin: {
    initialValue: false,
  },
};

export const useConfigStore = createStoreFactory<ConfigState, SliceConfigs>(sliceConfigs, STORE_NAME);
