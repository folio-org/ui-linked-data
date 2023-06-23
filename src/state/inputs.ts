import { atom } from 'recoil';

const userValues = atom<UserValue[]>({
  key: 'inputs.userValues',
  default: [],
});

const record = atom<Record<string, any>>({
  key: 'inputs.record',
  default: {},
});

export default {
  userValues,
  record,
};
