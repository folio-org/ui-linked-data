import { OKAPI_CONFIG } from '@common/constants/api.constants';
import { LOCALES } from '@common/i18n/locales';
import { localStorageService } from '@common/services/storage';
import { atom } from 'recoil';

const locale = atom<(typeof LOCALES)[keyof typeof LOCALES]>({
  key: 'config.locale',
  default: localStorageService.deserialize(OKAPI_CONFIG)?.locale || LOCALES.ENGLISH_US,
});

const i18nMessages = atom<I18nMessages>({
  key: 'config.i18nMessages',
  default: {},
});

const customEvents = atom<Record<string, string> | null>({
  key: 'config.customEvents',
  default: null,
});

const hasNavigationOrigin = atom<boolean>({
  key: 'config.hasNavigationOrigin',
  default: false,
});

export default {
  locale,
  i18nMessages,
  customEvents,
  hasNavigationOrigin,
};
