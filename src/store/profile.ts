import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore, type StateCreatorTyped } from './utils/storeCreator';

type SelectedProfileType = ProfileEntry | null;
type PreparedFieldsType = ResourceTemplates | null;
type InitialSchemaKeyType = string | null;

export type ProfileState = SliceState<'profiles', ProfileEntry[]> &
  SliceState<'selectedProfile', SelectedProfileType> &
  SliceState<'preparedFields', PreparedFieldsType> &
  SliceState<'initialSchemaKey', InitialSchemaKeyType> &
  SliceState<'schema', Map<string, SchemaEntry>>;

const STORE_NAME = 'Profile';

const profileStore: StateCreatorTyped<ProfileState> = (...args) => ({
  ...createBaseSlice({ basic: 'profiles' }, [] as ProfileEntry[])(...args),
  ...createBaseSlice({ basic: 'selectedProfile' }, null as SelectedProfileType)(...args),
  ...createBaseSlice({ basic: 'preparedFields' }, null as PreparedFieldsType)(...args),
  ...createBaseSlice({ basic: 'initialSchemaKey' }, null as InitialSchemaKeyType)(...args),
  ...createBaseSlice({ basic: 'schema' }, new Map())(...args),
});

export const useProfileStore = generateStore(profileStore, STORE_NAME);
