import { atom } from 'recoil';

const userValues = atom<UserValues>({
  key: 'inputs.userValues',
  default: {},
});

const record = atom<RecordEntry | null>({
  key: 'inputs.record',
  default: null,
});

export default {
  userValues,
  record,
};
