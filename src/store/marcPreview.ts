import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBaseSlice, SliceState } from './utils/slice';

type MarcPreviewData = MarcDTO | null;
type MarcPreviewMetaData = MarcPreviewMetadata | null;

export type MarcPreviewState = SliceState<'value', any> &
  SliceState<'data', MarcPreviewData> &
  SliceState<'metaData', MarcPreviewMetaData>;

const STORE_NAME = 'MarcPreview';

export const useMarcPreviewStore = create<MarcPreviewState>()(
  devtools((...args) => ({
    ...createBaseSlice('value', null, STORE_NAME)(...args),
    ...createBaseSlice('data', null as MarcPreviewData, STORE_NAME)(...args),
    ...createBaseSlice('metaData', null as MarcPreviewMetaData, STORE_NAME)(...args),
  })),
);
