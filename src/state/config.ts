import { OKAPI_CONFIG } from '@common/constants/api.constants';
import { LOCALES } from '@common/i18n/locales';
import { localStorageService } from '@common/services/storage';
import { atom } from 'recoil';

const profiles = atom<Array<ProfileEntry>>({
  key: 'config.profiles',
  default: [],
});

const selectedProfile = atom<ProfileEntry | null>({
  key: 'config.selectedProfile',
  default: null,
});

const preparedFields = atom<ResourceTemplates>({
  key: 'config.preparedFields',
  default: {},
});

const initialSchemaKey = atom<string | null>({
  key: 'config.initialSchemaKey',
  default: null,
});

const schema = atom<Map<string, SchemaEntry>>({
  key: 'config.schema',
  default: new Map(),
});

const selectedEntries = atom<Array<string>>({
  key: 'config.selectedEntries',
  default: [],
});

const locale = atom<(typeof LOCALES)[keyof typeof LOCALES]>({
  key: 'config.locale',
  default: localStorageService.deserialize(OKAPI_CONFIG)?.locale || LOCALES.ENGLISH,
});

const collectRecordDataForPreview = atom<boolean>({
  key: 'config.collectRecordDataForPreview',
  default: false,
});

export default {
  profiles,
  selectedProfile,
  preparedFields,
  schema,
  initialSchemaKey,
  selectedEntries,
  locale,
  collectRecordDataForPreview,
};
