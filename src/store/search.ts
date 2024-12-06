import {
  DEFAULT_FACET_BY_SEGMENT,
  DEFAULT_SEARCH_BY,
  DEFAULT_SEARCH_LIMITERS,
} from '@common/constants/search.constants';
import { createBaseSlice, SliceState } from './utils/slice';
import { generateStore, type StateCreatorTyped } from './utils/storeCreator';

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

const searchStore: StateCreatorTyped<SearchState> = (...args) => ({
  ...createBaseSlice({ basic: 'query' }, '')(...args),
  ...createBaseSlice({ basic: 'message' }, '')(...args),
  ...createBaseSlice({ basic: 'searchBy' }, DEFAULT_SEARCH_BY as SearchIdentifiers)(...args),
  ...createBaseSlice({ basic: 'data' }, null as Data)(...args),
  ...createBaseSlice({ basic: 'facets' }, DEFAULT_SEARCH_LIMITERS as Limiters)(...args),
  ...createBaseSlice({ basic: 'navigationState' }, {} as SearchParamsState)(...args),
  ...createBaseSlice({ basic: 'forceRefresh' }, false)(...args),
  ...createBaseSlice({ basic: 'pageMetadata' }, { totalElements: 0, totalPages: 0 } as PageMetadata)(...args),
  ...createBaseSlice({ basic: 'facetsBySegments' }, DEFAULT_FACET_BY_SEGMENT as FacetsBySegments)(...args),
  ...createBaseSlice({ basic: 'sourceData' }, null as SourceData)(...args),
  ...createBaseSlice({ basic: 'selectedFacetsGroups' }, [] as string[])(...args),
  ...createBaseSlice({ basic: 'facetsData' }, {} as FacetsDTO)(...args),
});

export const useSearchStore = generateStore(searchStore, STORE_NAME);
