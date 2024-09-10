import { atom } from 'recoil';

const lastSavedRecordId = atom<string | null>({
  key: 'status.record.lastSavedRecordId',
  default: null,
});

const recordIsEdited = atom<boolean>({
  key: 'status.record.isEdited',
  default: false,
});

const recordStatus = atom<RecordStatus>({
  key: 'status.record.recordStatus',
  default: { type: undefined },
});

const commonMessages = atom<StatusEntry[]>({
  key: 'status.common.messages',
  default: [],
});

export default {
  recordIsEdited,
  recordStatus,
  commonMessages,
  lastSavedRecordId,
};
