import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBaseSlice, SliceState } from './basic';

type LastSavedRecordId = string | null;

type StatusState = SliceState<'lastSavedRecordId', LastSavedRecordId> &
  SliceState<'isEditedRecord', boolean> &
  SliceState<'recordStatus', RecordStatus> &
  SliceState<'messages', StatusEntry[]>;

const STORE_NAME = 'Status';

export const useStatusStore = create<StatusState>()(
  devtools((...args) => ({
    ...createBaseSlice('lastSavedRecordId', null as LastSavedRecordId, STORE_NAME)(...args),
    ...createBaseSlice('isEditedRecord', false, STORE_NAME)(...args),
    ...createBaseSlice('recordStatus', { type: undefined } as RecordStatus, STORE_NAME)(...args),
    ...createBaseSlice('messages', [] as StatusEntry[], STORE_NAME)(...args),
  })),
);
