import { atom } from 'recoil';

const recordIsEdited = atom<boolean>({
  key: 'status.record.isEdited',
  default: false,
});

const recordIsInititallyLoaded = atom<boolean>({
  key: 'status.record.isInititallyLoaded',
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
  recordIsInititallyLoaded,
  recordStatus,
  commonMessages,
};
