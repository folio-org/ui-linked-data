import { atom } from 'recoil';

const isLoading = atom<boolean>({
  key: 'loadingState.isLoading',
  default: false,
});

export default {
  isLoading,
};
