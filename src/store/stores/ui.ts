import { FullDisplayType } from '@common/constants/uiElements.constants';
import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type UIEntries = Set<string>;

export type ProfileSelectionType = 'set' | 'changeForInstance' | 'changeForWork';

export type UIState = SliceState<'isAdvancedSearchOpen', boolean> &
  SliceState<'isMarcPreviewOpen', boolean> &
  SliceState<'isSearchPaneCollapsed', boolean> &
  SliceState<'isDuplicateImportedResourceModalOpen', boolean> &
  SliceState<'collapsedEntries', UIEntries> &
  SliceState<'collapsibleEntries', UIEntries> &
  SliceState<'currentlyEditedEntityBfid', UIEntries> &
  SliceState<'fullDisplayComponentType', FullDisplayType> &
  SliceState<'currentlyPreviewedEntityBfid', UIEntries> &
  SliceState<'hasShownAuthorityWarning', boolean> &
  SliceState<'isImportModalOpen', boolean> &
  SliceState<'isProfileSelectionModalOpen', boolean> &
  SliceState<'profileSelectionType', ProfileSelectionType>;

const STORE_NAME = 'UI';

const sliceConfigs: SliceConfigs = {
  isAdvancedSearchOpen: {
    initialValue: false,
  },
  isSearchPaneCollapsed: {
    initialValue: false,
  },
  fullDisplayComponentType: {
    initialValue: FullDisplayType.Basic,
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
  hasShownAuthorityWarning: {
    initialValue: false,
  },
  isImportModalOpen: {
    initialValue: false,
  },
  isProfileSelectionModalOpen: {
    initialValue: false,
  },
  profileSelectionType: {
    initialValue: 'set'
  }
};

export const useUIStore = createStoreFactory<UIState, SliceConfigs>(sliceConfigs, STORE_NAME);
