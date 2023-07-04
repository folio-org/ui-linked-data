import { atom } from 'recoil';

const recordIsEdited = atom<boolean>({
  key: 'status.recordIsEdited',
  default: false,
});

export default {
  recordIsEdited,
};
