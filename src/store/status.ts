import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore, type StateCreatorTyped } from './utils/storeCreator';

type LastSavedRecordId = string | null;

export type StatusState = SliceState<'lastSavedRecordId', LastSavedRecordId> &
  SliceState<'isEditedRecord', boolean> &
  SliceState<'recordStatus', RecordStatus> &
  SliceState<'statusMessages', StatusEntry[], 'statusMessage', StatusEntry>;

const STORE_NAME = 'Status';

const statusStore: StateCreatorTyped<StatusState> = (...args) => ({
  ...createBaseSlice({ basic: 'lastSavedRecordId' }, null as LastSavedRecordId)(...args),
  ...createBaseSlice({ basic: 'isEditedRecord' }, false)(...args),
  ...createBaseSlice({ basic: 'recordStatus' }, { type: undefined } as RecordStatus)(...args),
  ...createBaseSlice<'statusMessages', StatusEntry[], 'statusMessage', StatusEntry>(
    { basic: 'statusMessages', singleItem: 'statusMessage' },
    [] as StatusEntry[],
    true,
  )(...args),
});

export const useStatusStore = generateStore(statusStore, STORE_NAME);
