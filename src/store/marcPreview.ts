import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IS_PROD_MODE } from '@common/constants/bundle.constants';
import { createBaseSlice, SliceState } from './utils/slice';

type MarcPreviewData = MarcDTO | null;
type MarcPreviewMetaData = MarcPreviewMetadata | null;

export type MarcPreviewState = SliceState<'basicValue', any> &
  SliceState<'complexValue', MarcPreviewData> &
  SliceState<'metaData', MarcPreviewMetaData>;

const STORE_NAME = 'MarcPreview';

export const useMarcPreviewStore = create<MarcPreviewState>()(
  devtools(
    (...args) => ({
      ...createBaseSlice('basicValue', null, STORE_NAME)(...args),
      ...createBaseSlice('complexValue', null as MarcPreviewData, STORE_NAME)(...args),
      ...createBaseSlice('metaData', null as MarcPreviewMetaData, STORE_NAME)(...args),
    }),
    { enabled: !IS_PROD_MODE },
  ),
);
