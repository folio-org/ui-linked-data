import { atom } from 'recoil';

const isAdvancedSearchOpen = atom<boolean>({
  key: 'ui.isAdvancedSearchOpen',
  default: false,
});

const isMarcPreviewOpen = atom<boolean>({
  key: 'ui.isMarcPreviewOpen',
  default: false,
});

const isDuplicateImportedResourceModalOpen = atom<boolean>({
  key: 'ui.isDuplicateImportedResourceModalOpen',
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
  isMarcPreviewOpen,
  collapsedGroups,
  currentlyEditedEntityBfid,
  currentlyPreviewedEntityBfid,
  isDuplicateImportedResourceModalOpen,
};
