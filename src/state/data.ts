import { atom } from 'recoil';

const marcPreview = atom<any>({
  key: 'data.marcPreview',
  default: null,
});

const marcPreviewData = atom<MarcDTO | null>({
  key: 'data.marcPreviewData',
  default: null,
});

const marcPreviewMetadata = atom<MarcPreviewMetadata | null>({
  key: 'data.marcPreviewMetadata',
  default: null,
});

export default {
  marcPreview,
  marcPreviewData,
  marcPreviewMetadata,
};
