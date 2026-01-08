import {
  DEFAULT_FACET_BY_SEGMENT,
  DEFAULT_SEARCH_BY,
  DEFAULT_SEARCH_LIMITERS,
} from '@common/constants/search.constants';
import { type SliceState } from '../utils/slice';
import { createStoreFactory, SliceConfigs } from '../utils/createStoreFactory';

type Data = null | WorkAsSearchResultDTO[];
type SourceData = SourceDataDTO | null;

export interface SegmentDraft {
  query: string;
  searchBy: SearchIdentifiers;
  source?: string;
}

export type DraftBySegment = Record<string, SegmentDraft>;

export interface CommittedValues {
  segment?: string;
  query: string;
  searchBy: string;
  source?: string;
  offset: number;
  selector?: 'query' | 'prev' | 'next'; // Browse pagination selector
}

const DEFAULT_COMMITTED_VALUES: CommittedValues = {
  segment: undefined,
  query: '',
  searchBy: DEFAULT_SEARCH_BY,
  source: undefined,
  offset: 0,
  selector: 'query',
};

export type SearchState = SliceState<'query', string> &
  SliceState<'message', string> &
  SliceState<'searchBy', SearchIdentifiers> &
  SliceState<'committedValues', CommittedValues> &
  SliceState<'draftBySegment', DraftBySegment> &
  SliceState<'data', Data> &
  SliceState<'facets', Limiters> &
  SliceState<'navigationState', SearchParamsState> &
  SliceState<'forceRefresh', boolean> &
  SliceState<'pageMetadata', PageMetadata> &
  SliceState<'facetsBySegments', FacetsBySegments> &
  SliceState<'sourceData', SourceData> &
  SliceState<'selectedFacetsGroups', string[]> &
  SliceState<'facetsData', FacetsDTO> &
  SliceState<'selectedInstances', string[]>;

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
  committedValues: {
    initialValue: DEFAULT_COMMITTED_VALUES,
  },
  draftBySegment: {
    initialValue: {} as DraftBySegment,
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
  selectedInstances: {
    initialValue: [],
  },
};

export const useSearchStore = createStoreFactory<SearchState, SliceConfigs>(sliceConfigs, STORE_NAME);
