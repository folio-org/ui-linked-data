import { atom } from 'recoil';

const isAdvancedSearchOpen = atom<boolean>({
  key: 'ui.isAdvancedSearchOpen',
  default: false,
});

const isEditSectionOpen = atom<boolean>({
  key: 'ui.isEditSectionOpen',
  default: false,
});

export default {
  isAdvancedSearchOpen,
  isEditSectionOpen,
};
