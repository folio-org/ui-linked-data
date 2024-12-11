import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type UIEntries = Set<string>;

export type UIState = SliceState<'isAdvancedSearchOpen', boolean> &
  SliceState<'isMarcPreviewOpen', boolean> &
  SliceState<'isDuplicateImportedResourceModalOpen', boolean> &
  SliceState<'collapsedEntries', UIEntries> &
  SliceState<'collapsibleEntries', UIEntries> &
  SliceState<'currentlyEditedEntityBfid', UIEntries> &
  SliceState<'currentlyPreviewedEntityBfid', UIEntries>;

const STORE_NAME = 'UI';

const sliceConfigs: SliceConfigs = {
  isAdvancedSearchOpen: {
    initialValue: false,
  },
  isMarcPreviewOpen: {
    initialValue: false,
  },
  isDuplicateImportedResourceModalOpen: {
    initialValue: false,
  },
  collapsedEntries: {
    initialValue: new Set(),
  },
  collapsibleEntries: {
    initialValue: new Set(),
  },
  currentlyEditedEntityBfid: {
    initialValue: new Set(),
  },
  currentlyPreviewedEntityBfid: {
    initialValue: new Set(),
  },
};

export const useUIStore = createStoreFactory<UIState, SliceConfigs>(sliceConfigs, STORE_NAME);
