import { atom } from 'recoil';

const userValues = atom<UserValues>({
  key: 'inputs.userValues',
  default: {},
});

const previewContent = atom<PreviewContent[]>({
  key: 'inputs.previewContent',
  default: [],
});

const record = atom<RecordEntryDeprecated | RecordEntry | null>({
  key: 'inputs.record',
  default: null,
});

export default {
  userValues,
  record,
  previewContent,
};
