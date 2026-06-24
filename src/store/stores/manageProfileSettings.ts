import { DEFAULT_INACTIVE_SETTINGS } from '@/common/constants/profileSettings.constants';

import { type SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type ProfileState = Profile | null;
type ProfileDTOState = ProfileDTO | null;
type ProfileSettingsMetaState = ProfileSettingsMeta | null;

export type ManageProfileSettingsState = SliceState<'selectedProfile', ProfileDTO> &
  SliceState<'nextSelectedProfile', ProfileDTOState> &
  SliceState<'fullProfile', ProfileState> &
  SliceState<'selectedProfileSettingsMeta', ProfileSettingsMetaState> &
  SliceState<'unusedComponents', ProfileSettingComponent[]> &
  SliceState<'selectedComponents', ProfileSettingComponent[]> &
  SliceState<'isClosingNext', boolean> &
  SliceState<'isSettingsActive', boolean> &
  SliceState<'profileSettings', ProfileSettingsWithDrift> &
  SliceState<'isTypeDefaultProfile', boolean> &
  SliceState<'isModified', boolean> &
  SliceState<'settingsName', string>;

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
  selectedProfileSettingsMeta: {
    initialValue: null,
  },
  unusedComponents: {
    initialValue: [],
  },
  selectedComponents: {
    initialValue: [],
  },
  isClosingNext: {
    initialValue: false,
  },
  isSettingsActive: {
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
  settingsName: {
    initialValue: '',
  },
};

export const useManageProfileSettingsStore = createStoreFactory<ManageProfileSettingsState, SliceConfigs>(
  sliceConfigs,
  STORE_NAME,
);
