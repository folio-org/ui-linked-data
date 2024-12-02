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
      ...createBaseSlice({ basic: 'basicValue' }, null)(...args),
      ...createBaseSlice({ basic: 'complexValue' }, null as MarcPreviewData)(...args),
      ...createBaseSlice({ basic: 'metaData' }, null as MarcPreviewMetaData)(...args),
    }),
    { name: 'Linked Data Editor', store: STORE_NAME, enabled: !IS_PROD_MODE },
  ),
);
