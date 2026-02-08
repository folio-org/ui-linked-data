import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';

import { type SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type ProfileState = Profile | null;
type ProfileDTOState = ProfileDTO | null;

export type ManageProfileSettingsState = SliceState<'selectedProfile', ProfileDTO> &
  SliceState<'nextSelectedProfile', ProfileDTOState> &
  SliceState<'fullProfile', ProfileState> &
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
    initialValue: DEFAULT_INACTIVE_SETTINGS,
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
