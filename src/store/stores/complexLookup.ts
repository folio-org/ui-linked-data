import { type SliceState } from '../utils/slice';
import { createStoreFactory, SliceConfigs } from '../utils/createStoreFactory';

export type ComplexLookupState = SliceState<'authorityAssignmentCheckFailedIds', string[], string>;

const STORE_NAME = 'ComplexLookup';

const sliceConfigs: SliceConfigs = {
  authorityAssignmentCheckFailedIds: {
    initialValue: [],
    singleItem: { type: '' },
  },
};

export const useComplexLookupStore = createStoreFactory<ComplexLookupState, SliceConfigs>(sliceConfigs, STORE_NAME);
