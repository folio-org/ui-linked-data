import { atom } from 'recoil';

const profiles = atom<Array<ProfileEntry>>({
  key: 'config.profiles',
  default: [],
});

const selectedProfile = atom<ProfileEntry | null>({
  key: 'config.selectedProfile',
  default: null,
});

const preparedFields = atom<PreparedFields>({
  key: 'config.preparedFields',
  default: {},
});

const normalizedFields = atom<Map<string, any>>({
  key: 'config.normalizedFields',
  default: new Map(),
});

export default {
  profiles,
  selectedProfile,
  preparedFields,
  normalizedFields,
};
