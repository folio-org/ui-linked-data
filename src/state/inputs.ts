import { atom } from 'recoil';

const userValues = atom<UserValue[]>({
  key: 'inputs.userValues',
  default: [],
});

const record = atom<Record<string, any> | null>({
  key: 'inputs.record',
  default: null,
});

export default {
  userValues,
  record,
};
