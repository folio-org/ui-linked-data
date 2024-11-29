import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBaseSlice, SliceState } from './utils/slice';

type LastSavedRecordId = string | null;

export type StatusState = SliceState<'lastSavedRecordId', LastSavedRecordId> &
  SliceState<'isEditedRecord', boolean> &
  SliceState<'recordStatus', RecordStatus> &
  SliceState<'statusMessages', StatusEntry[], StatusEntry>;

const STORE_NAME = 'Status';

export const useStatusStore = create<StatusState>()(
  devtools((...args) => ({
    ...createBaseSlice('lastSavedRecordId', null as LastSavedRecordId, STORE_NAME)(...args),
    ...createBaseSlice('isEditedRecord', false, STORE_NAME)(...args),
    ...createBaseSlice('recordStatus', { type: undefined } as RecordStatus, STORE_NAME)(...args),
    ...createBaseSlice<'statusMessages', StatusEntry[], StatusEntry>(
      'statusMessages',
      [] as StatusEntry[],
      STORE_NAME,
      true
    )(...args),
  })),
);
