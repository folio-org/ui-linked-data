import { atom } from 'recoil';

const marcPreview = atom<any>({
  key: 'data.marcPreview',
  default: null,
});

export default {
  marcPreview,
};
