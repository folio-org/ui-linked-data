import { createStoreFactory, type SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type LastSavedRecordId = string | null;

export type StatusState = SliceState<'lastSavedRecordId', LastSavedRecordId> &
  SliceState<'isEditedRecord', boolean> &
  SliceState<'recordStatus', RecordStatus> &
  SliceState<'statusMessages', StatusEntry[], StatusEntry>;

const STORE_NAME = 'Status';

const sliceConfigs: SliceConfigs = {
  lastSavedRecordId: {
    initialValue: null,
  },
  isEditedRecord: {
    initialValue: false,
  },
  recordStatus: {
    initialValue: { type: undefined },
  },
  statusMessages: {
    initialValue: [],
    singleItem: { type: {} },
    canAddSingleItem: true,
  },
};

export const useStatusStore = createStoreFactory<StatusState, SliceConfigs>(sliceConfigs, STORE_NAME);
