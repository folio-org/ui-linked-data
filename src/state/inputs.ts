import { atom } from 'recoil';

const userValues = atom<UserValues>({
  key: 'inputs.userValues',
  default: {},
});

const previewContent = atom<Record<string, { base: Map<string, any>, userValues: UserValues, initKey: string }>>({
  key: 'inputs.previewContent',
  default: {},
});

const record = atom<RecordEntryDeprecated | null>({
  key: 'inputs.record',
  default: null,
});

export default {
  userValues,
  record,
  previewContent,
};
