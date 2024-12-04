import { atom } from 'recoil';

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
  record,
  previewContent,
  selectedRecordBlocks,
};
