import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type ManageProfileSettingsState = SliceState<'selectedProfile', ProfileDTO> &
  SliceState<'nextSelectedProfile', ProfileDTO> &
  SliceState<'fullProfile', Profile> &
  SliceState<'isClosingNext', boolean> &
  SliceState<'profileSettings', ProfileSettingsWithDrift> &
  SliceState<'isTypeDefaultProfile', boolean> &
  SliceState<'isModified', boolean>;

const STORE_NAME = 'ProfileSettings';

const sliceConfigs: SliceConfigs = {
  selectedProfile: {
    initialValue: null,
  },
  nextSelectedProfile: {
    initialValue: null,
  },
  fullProfile: {
    initialValue: null,
  },
  isClosingNext: {
    initialValue: false,
  },
  profileSettings: {
    initialValue: {
      active: false,
    },
  },
  isTypeDefaultProfile: {
    initialValue: false,
  },
  isModified: {
    initialValue: false,
  },
};

export const useManageProfileSettingsStore = createStoreFactory<ManageProfileSettingsState, SliceConfigs>(
  sliceConfigs,
  STORE_NAME,
);
