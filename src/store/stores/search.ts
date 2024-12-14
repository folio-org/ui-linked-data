import {
  DEFAULT_FACET_BY_SEGMENT,
  DEFAULT_SEARCH_BY,
  DEFAULT_SEARCH_LIMITERS,
} from '@common/constants/search.constants';
import { type SliceState } from '../utils/slice';
import { createStoreFactory, SliceConfigs } from '../utils/createStoreFactory';

type Data = null | WorkAsSearchResultDTO[];
type SourceData = SourceDataDTO | null;

export type SearchState = SliceState<'query', string> &
  SliceState<'message', string> &
  SliceState<'searchBy', SearchIdentifiers> &
  SliceState<'data', Data> &
  SliceState<'facets', Limiters> &
  SliceState<'navigationState', SearchParamsState> &
  SliceState<'forceRefresh', boolean> &
  SliceState<'pageMetadata', PageMetadata> &
  SliceState<'facetsBySegments', FacetsBySegments> &
  SliceState<'sourceData', SourceData> &
  SliceState<'selectedFacetsGroups', string[]> &
  SliceState<'facetsData', FacetsDTO>;

const STORE_NAME = 'Search';

const sliceConfigs: SliceConfigs = {
  query: {
    initialValue: '',
  },
  message: {
    initialValue: '',
  },
  searchBy: {
    initialValue: DEFAULT_SEARCH_BY,
  },
  data: {
    initialValue: null,
  },
  facets: {
    initialValue: DEFAULT_SEARCH_LIMITERS,
  },
  navigationState: {
    initialValue: {},
  },
  forceRefresh: {
    initialValue: false,
  },
  pageMetadata: {
    initialValue: { totalElements: 0, totalPages: 0 },
  },
  facetsBySegments: {
    initialValue: DEFAULT_FACET_BY_SEGMENT,
  },
  sourceData: {
    initialValue: null,
  },
  selectedFacetsGroups: {
    initialValue: [],
  },
  facetsData: {
    initialValue: {},
  },
};

export const useSearchStore = createStoreFactory<SearchState, SliceConfigs>(sliceConfigs, STORE_NAME);
