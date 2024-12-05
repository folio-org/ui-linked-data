import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore, type StateCreatorTyped } from './utils/storeCreator';

export type RecordState = RecordEntry | null;
export type SelectedRecordBlocksState = SelectedRecordBlocks | undefined;
export type SelectedEntriesState = string[];

export type InputsState = SliceState<'userValues', UserValues> &
  SliceState<'previewContent', PreviewContent[]> &
  SliceState<'record', RecordState> &
  SliceState<'selectedRecordBlocks', SelectedRecordBlocksState> &
  SliceState<'selectedEntries', SelectedEntriesState>;

const STORE_NAME = 'Inputs';

const inputsStore: StateCreatorTyped<InputsState> = (...args) => ({
  ...createBaseSlice({ basic: 'userValues' }, {} as UserValues, true)(...args),
  ...createBaseSlice({ basic: 'previewContent' }, [] as PreviewContent[])(...args),
  ...createBaseSlice({ basic: 'record' }, null as RecordState)(...args),
  ...createBaseSlice({ basic: 'selectedRecordBlocks' }, undefined as SelectedRecordBlocksState)(...args),
  ...createBaseSlice({ basic: 'selectedEntries' }, [] as SelectedEntriesState)(...args),
});

export const useInputsStore = generateStore(inputsStore, STORE_NAME);
