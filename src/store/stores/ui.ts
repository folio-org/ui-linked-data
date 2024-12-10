import { createBaseSlice, SliceState } from '../utils/slice';
import { generateStore, type StateCreatorTyped } from '../utils/storeCreator';

export type UIEntries = Set<string>;

export type uiState = SliceState<'isAdvancedSearchOpen', boolean> &
  SliceState<'isMarcPreviewOpen', boolean> &
  SliceState<'isDuplicateImportedResourceModalOpen', boolean> &
  SliceState<'collapsedEntries', UIEntries> &
  SliceState<'collapsibleEntries', UIEntries> &
  SliceState<'currentlyEditedEntityBfid', UIEntries> &
  SliceState<'currentlyPreviewedEntityBfid', UIEntries>;

const STORE_NAME = 'UI';

const uiStore: StateCreatorTyped<uiState> = (...args) => ({
  ...createBaseSlice({ basic: 'isAdvancedSearchOpen' }, false)(...args),
  ...createBaseSlice({ basic: 'isMarcPreviewOpen' }, false)(...args),
  ...createBaseSlice({ basic: 'isDuplicateImportedResourceModalOpen' }, false)(...args),
  ...createBaseSlice({ basic: 'collapsedEntries' }, new Set() as UIEntries)(...args),
  ...createBaseSlice({ basic: 'collapsibleEntries' }, new Set() as UIEntries)(...args),
  ...createBaseSlice({ basic: 'currentlyEditedEntityBfid' }, new Set() as UIEntries)(...args),
  ...createBaseSlice({ basic: 'currentlyPreviewedEntityBfid' }, new Set() as UIEntries)(...args),
});

export const useUIStore = generateStore(uiStore, STORE_NAME);
