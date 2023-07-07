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

const schema = atom<Map<string, any>>({
  key: 'config.schema',
  default: new Map(),
});

const selectedEntries = atom<Array<string>>({
  key: 'config.selectedEntries',
  default: [],
});

export default {
  profiles,
  selectedProfile,
  preparedFields,
  schema,
  initialSchemaKey,
  selectedEntries,
};
