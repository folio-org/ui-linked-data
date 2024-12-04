import { StateCreator } from 'zustand';
import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore } from './utils/storeCreator';

type RecordState = RecordEntry | null;
type SelectedRecordBlocksState = RecordEntry | null;
type SelectedEntriesState = SelectedRecordBlocks | undefined;

export type InputsState = SliceState<'userValues', UserValues> &
  SliceState<'previewContent', PreviewContent[]> &
  SliceState<'record', RecordState> &
  SliceState<'selectedRecordBlocks', SelectedRecordBlocksState> &
  SliceState<'selectedEntries', SelectedEntriesState>;

const STORE_NAME = 'Inputs';

const inputsStore: StateCreator<InputsState, [['zustand/devtools', never]], []> = (...args) => ({
  ...createBaseSlice({ basic: 'userValues' }, {} as UserValues, true)(...args),
  ...createBaseSlice({ basic: 'previewContent' }, [] as PreviewContent[])(...args),
  ...createBaseSlice({ basic: 'record' }, null as RecordState)(...args),
  ...createBaseSlice({ basic: 'selectedRecordBlocks' }, null as SelectedRecordBlocksState)(...args),
  ...createBaseSlice({ basic: 'selectedEntries' }, undefined as SelectedEntriesState)(...args),
});

export const useInputsStore = generateStore(inputsStore, STORE_NAME);
