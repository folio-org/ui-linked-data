import { type SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type SelectedProfileType = Profile | null;
type SelectedProfileSettingsType = ProfileSettings | null;
type InitialSchemaKeyType = string | null;
export type AvailableProfiles = {
  [key in ResourceTypeURL]: ProfileDTO[];
};
export type PreferredProfiles = ProfileDTO[];

export type ProfileState = SliceState<'availableProfiles', AvailableProfiles> &
  SliceState<'preferredProfiles', PreferredProfiles> &
  SliceState<'selectedProfile', SelectedProfileType> &
  SliceState<'selectedProfileSettings', SelectedProfileSettingsType> &
  SliceState<'initialSchemaKey', InitialSchemaKeyType> &
  SliceState<'schema', Map<string, SchemaEntry>>;

const STORE_NAME = 'Profile';

const sliceConfigs: SliceConfigs = {
  availableProfiles: {
    initialValue: null,
  },
  preferredProfiles: {
    initialValue: null,
  },
  selectedProfile: {
    initialValue: null,
  },
  selectedProfileSettings: {
    initialValue: null,
  },
  initialSchemaKey: {
    initialValue: null,
  },
  schema: {
    initialValue: new Map(),
  },
};

export const useProfileStore = createStoreFactory<ProfileState, SliceConfigs>(sliceConfigs, STORE_NAME);
