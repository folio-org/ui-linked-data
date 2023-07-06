import { atom } from 'recoil';

const userValues = atom<UserValue[]>({
  key: 'inputs.userValues',
  default: [],
});

const record = atom<RecordEntry | null>({
  key: 'inputs.record',
  default: null,
});

export default {
  userValues,
  record,
};
