import { atom } from 'recoil';

const isAdvancedSearchOpen = atom<boolean>({
  key: 'ui.isAdvancedSearchOpen',
  default: false,
});

export default {
  isAdvancedSearchOpen,
};
