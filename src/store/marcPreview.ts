import { StateCreator } from 'zustand';
import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore } from './utils/storeCreator';

type MarcPreviewData = MarcDTO | null;
type MarcPreviewMetaData = MarcPreviewMetadata | null;

export type MarcPreviewState = SliceState<'basicValue', any> &
  SliceState<'complexValue', MarcPreviewData> &
  SliceState<'metaData', MarcPreviewMetaData>;

const STORE_NAME = 'MarcPreview';

const marcPreviewStore: StateCreator<MarcPreviewState, [['zustand/devtools', never]], []> = (...args) => ({
  ...createBaseSlice({ basic: 'basicValue' }, null)(...args),
  ...createBaseSlice({ basic: 'complexValue' }, null as MarcPreviewData)(...args),
  ...createBaseSlice({ basic: 'metaData' }, null as MarcPreviewMetaData)(...args),
});

export const useMarcPreviewStore = generateStore(marcPreviewStore, STORE_NAME);
