import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type ManageProfileSettingsState = SliceState<'profileSettings', ProfileSettings> &
  SliceState<'isTypeDefaultProfile', boolean>;

const STORE_NAME = 'ProfileSettings';

const sliceConfigs: SliceConfigs = {
  profileSettings: {
    initialValue: {
      active: false,
    },
  },
  isTypeDefaultProfile: {
    initialValue: false,
  },
};

export const useManageProfileSettingsStore = createStoreFactory<ManageProfileSettingsState, SliceConfigs>(sliceConfigs, STORE_NAME);
