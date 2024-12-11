import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type SelectedProfileType = ProfileEntry | null;
type PreparedFieldsType = ResourceTemplates | null;
type InitialSchemaKeyType = string | null;

export type ProfileState = SliceState<'profiles', ProfileEntry[]> &
  SliceState<'selectedProfile', SelectedProfileType> &
  SliceState<'preparedFields', PreparedFieldsType> &
  SliceState<'initialSchemaKey', InitialSchemaKeyType> &
  SliceState<'schema', Map<string, SchemaEntry>>;

const STORE_NAME = 'Profile';

const sliceConfigs: SliceConfigs = {
  profiles: {
    initialValue: [],
  },
  selectedProfile: {
    initialValue: null,
  },
  preparedFields: {
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
