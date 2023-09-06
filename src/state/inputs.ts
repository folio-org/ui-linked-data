import { atom } from 'recoil';

const userValues = atom<UserValues>({
  key: 'inputs.userValues',
  default: {},
});

const record = atom<RecordEntryDeprecated | null>({
  key: 'inputs.record',
  default: null,
});

export default {
  userValues,
  record,
};
