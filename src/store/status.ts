import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IS_PROD_MODE } from '@common/constants/bundle.constants';
import { createBaseSlice, SliceState } from './utils/slice';

type LastSavedRecordId = string | null;

export type StatusState = SliceState<'lastSavedRecordId', LastSavedRecordId> &
  SliceState<'isEditedRecord', boolean> &
  SliceState<'recordStatus', RecordStatus> &
  SliceState<'statusMessages', StatusEntry[], 'statusMessage', StatusEntry>;

const STORE_NAME = 'Status';

export const useStatusStore = create<StatusState>()(
  devtools(
    (...args) => ({
      ...createBaseSlice({ basic: 'lastSavedRecordId' }, null as LastSavedRecordId)(...args),
      ...createBaseSlice({ basic: 'isEditedRecord' }, false)(...args),
      ...createBaseSlice({ basic: 'recordStatus' }, { type: undefined } as RecordStatus)(...args),
      ...createBaseSlice<'statusMessages', StatusEntry[], 'statusMessage', StatusEntry>(
        { basic: 'statusMessages', singleItem: 'statusMessage' },
        [] as StatusEntry[],
        true,
      )(...args),
    }),
    { name: 'Linked Data Editor', store: STORE_NAME, enabled: !IS_PROD_MODE },
  ),
);
