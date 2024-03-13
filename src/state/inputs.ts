import { atom } from 'recoil';

const userValues = atom<UserValues>({
  key: 'inputs.userValues',
  default: {},
});

const previewContent = atom<PreviewContent[]>({
  key: 'inputs.previewContent',
  default: [],
});

const record = atom<RecordEntry | null>({
  key: 'inputs.record',
  default: null,
});

const selectedRecordBlocks = atom<SelectedRecordBlocks | undefined>({
  key: 'inputs.selectedRecordBlocks',
  default: undefined,
});

export default {
  userValues,
  record,
  previewContent,
  selectedRecordBlocks,
};
