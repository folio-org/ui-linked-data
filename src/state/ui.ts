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

const collapsedEntries = atom<Set<string>>({
  key: 'ui.collapsedEntries',
  default: new Set(),
});

const collapsibleEntries = atom<Set<string>>({
  key: 'ui.collapsibleEntries',
  default: new Set(),
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
  collapsedEntries,
  currentlyEditedEntityBfid,
  currentlyPreviewedEntityBfid,
  isDuplicateImportedResourceModalOpen,
  collapsibleEntries,
};
