import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

export type RecordState = RecordEntry | null;
export type SelectedRecordBlocksState = SelectedRecordBlocks | undefined;
export type SelectedEntriesState = string[];

export type InputsState = SliceState<'userValues', UserValues> &
  SliceState<'previewContent', PreviewContent[]> &
  SliceState<'record', RecordState> &
  SliceState<'selectedRecordBlocks', SelectedRecordBlocksState> &
  SliceState<'selectedEntries', SelectedEntriesState>;

const STORE_NAME = 'Inputs';

const sliceConfigs: SliceConfigs = {
  userValues: {
    initialValue: {},
    canAddSingleItem: true,
    singleItem: { type: {} as UserValue },
  },
  previewContent: {
    initialValue: [],
  },
  record: {
    initialValue: null,
  },
  selectedRecordBlocks: {
    initialValue: undefined,
  },
  selectedEntries: {
    initialValue: [],
  },
};

export const useInputsStore = createStoreFactory<InputsState, SliceConfigs>(sliceConfigs, STORE_NAME);
