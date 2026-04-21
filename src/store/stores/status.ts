import { type SliceConfigs, createStoreFactory } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type LastSavedRecordId = string | null;

export type StatusState = SliceState<'lastSavedRecordId', LastSavedRecordId> &
  SliceState<'isRecordEdited', boolean> &
  SliceState<'recordStatus', RecordStatus> &
  SliceState<'statusMessages', StatusEntry[], StatusEntry>;

const STORE_NAME = 'Status';

const sliceConfigs: SliceConfigs = {
  lastSavedRecordId: {
    initialValue: null,
  },
  isRecordEdited: {
    initialValue: false,
  },
  recordStatus: {
    initialValue: { type: undefined },
  },
  statusMessages: {
    initialValue: [],
    singleItem: { type: {} },
  },
};

export const useStatusStore = createStoreFactory<StatusState, SliceConfigs>(sliceConfigs, STORE_NAME);
