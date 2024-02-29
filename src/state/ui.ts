import { atom } from 'recoil';

const isAdvancedSearchOpen = atom<boolean>({
  key: 'ui.isAdvancedSearchOpen',
  default: false,
});

const isEditSectionOpen = atom<boolean>({
  key: 'ui.isEditSectionOpen',
  default: false,
});

const collapsedGroups = atom<string[]>({
  key: 'ui.collapsedGroups',
  default: [],
});

const currentlyEditedEntityBfid = atom<Set<string>>({
  key: 'ui.currentlyEditedEntityBfid',
  default: new Set(),
});

const currentlyPreviewedEntityBfid = atom<Set<string>>({
  key: 'ui.currentlyPreviewedEntityBfid',
  default: new Set(),
});

export default {
  isAdvancedSearchOpen,
  isEditSectionOpen,
  collapsedGroups,
  currentlyEditedEntityBfid,
  currentlyPreviewedEntityBfid,
};
