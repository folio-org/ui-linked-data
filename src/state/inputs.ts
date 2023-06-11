import { atom } from 'recoil';
const userValues = atom<UserValue[]>({
  key: 'config.userValues',
  default: [],
});

const userInputScheme = atom<Record<string, any>>({
  key: 'config.userInputScheme',
  default: {},
});

const userInputScheme = atom<any>({
    key: 'config.userInputScheme',
    default: {}
})

export default {
  userValues,
  userInputScheme,
};
