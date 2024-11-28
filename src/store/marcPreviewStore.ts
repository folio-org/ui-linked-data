import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBaseSlice, SliceState } from './basic';

type MarcPreviewData = MarcDTO | null;
type MarcPreviewMetaData = MarcPreviewMetadata | null;

type MarcPreviewStoreState = SliceState<'value', any> &
  SliceState<'data', MarcPreviewData> &
  SliceState<'metaData', MarcPreviewMetaData>;

const STORE_NAME = 'MarcPreview';

export const useMarcPreviewStore = create<MarcPreviewStoreState>()(
  devtools((...args) => ({
    ...createBaseSlice('value', null, STORE_NAME)(...args),
    ...createBaseSlice('data', null as MarcPreviewData, STORE_NAME)(...args),
    ...createBaseSlice('metaData', null as MarcPreviewMetaData, STORE_NAME)(...args),
  })),
);
