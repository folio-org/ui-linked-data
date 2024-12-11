import { createStoreFactory, SliceConfigs } from '../utils/createStoreFactory';
import { type SliceState } from '../utils/slice';

type MarcPreviewData = MarcDTO | null;
type MarcPreviewMetaData = MarcPreviewMetadata | null;

export type MarcPreviewState = SliceState<'basicValue', any> &
  SliceState<'complexValue', MarcPreviewData> &
  SliceState<'metaData', MarcPreviewMetaData>;

const STORE_NAME = 'MarcPreview';

const sliceConfigs: SliceConfigs = {
  basicValue: {
    initialValue: null,
  },
  complexValue: {
    initialValue: null,
  },
  metaData: {
    initialValue: null,
  },
};

export const useMarcPreviewStore = createStoreFactory<MarcPreviewState, SliceConfigs>(sliceConfigs, STORE_NAME);
