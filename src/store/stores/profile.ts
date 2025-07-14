import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type SelectedProfileType = Profile | null;
type InitialSchemaKeyType = string | null;
type ProfilesMetadata = ProfileDTO[];
type PreferredProfiles = ProfileDTO[];

export type ProfileState = SliceState<'profiles', Record<string, Profile>> &
  SliceState<'profilesMetadata', ProfilesMetadata> &
  SliceState<'preferredProfiles', PreferredProfiles> &
  SliceState<'selectedProfile', SelectedProfileType> &
  SliceState<'initialSchemaKey', InitialSchemaKeyType> &
  SliceState<'schema', Map<string, SchemaEntry>>;

const STORE_NAME = 'Profile';

const sliceConfigs: SliceConfigs = {
  profiles: {
    initialValue: {},
  },
  profilesMetadata: {
    initialValue: null,
  },
  preferredProfiles: {
    initialValue: null,
  },
  selectedProfile: {
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
