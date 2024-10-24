type SearchQueryParams = import('@common/constants/routes.constants').SearchQueryParams;
type ComplexLookupSearchIdentifiers = import('@common/constants/complexLookup.constants').ComplexLookupSearchableIndex;
type SearchIdentifiers = import('@common/constants/search.constants').SearchIdentifiers &
  ComplexLookupSearchIdentifiers;
type SearchSegmentValue = import('@common/constants/search.constants').SearchSegment;

type SearchParamsState = {
  [key in SearchQueryParams]?: string | number | SearchIdentifiers;
};

type NavigationSegment = {
  value?: string;
  set: Dispatch<SetStateAction<boolean>> | VoidFunction;
};

type EndpointUrlsBySegments = {
  [key in SearchSegment]: string;
};

type SearchParams = {
  endpointUrl: string;
  endpointUrlsBySegments?: EndpointUrlsBySegments;
  primarySegments?: PrimarySegmentsConfig;
  searchFilter?: string;
  hasSearchParams: boolean;
  defaultSearchBy: SearchIdentifiers;
  defaultQuery?: string;
  filters: SearchFilters;
  renderSearchControlPane: () => JSX.Element | null;
  renderResultsList: () => JSX.Element | null;
  isSortedResults?: boolean;
  isVisibleFilters?: boolean;
  isVisibleFullDisplay?: boolean;
  isVisibleAdvancedSearch?: boolean;
  isVisibleSearchByControl?: boolean;
  isVisibleSegments?: boolean;
  hasMultilineSearchInput?: boolean;
  searchByControlOptions?: (string | SelectValue)[] | ComplexLookupSearchBy;
  searchableIndicesMap?: SearchableIndicesMap;
  labelEmptySearch?: string;
  classNameEmptyPlaceholder?: string;
  navigationSegment?: NavigationSegment;
  getSearchSourceData?: (url?: string) => Promise<void>;
  getSearchFacetsData?: (facet?: string, isOpen?: boolean) => Promise<void>;
  searchResultsLimit?: number;
  precedingRecordsCount?: number;
  fetchSearchResults?: (params: any) => Promise<SearchResults>;
  buildSearchQuery?: (params: BuildSearchQueryParams) => string | undefined;
  searchResultsContainer?: {
    [key in SearchSegment]: string;
  };
  hasMarcPreview?: boolean;
  hasCustomPagination?: boolean;
  renderMarcPreview?: () => JSX.Element | null;
  onAssignRecord?: ({ id, title, linkedFieldValue }: ComplexLookupAssignRecordDTO) => void;
};

type FacetsBySegments = {
  [key in SearchSegmentValue]: {
    query?: string;
    searchBy?: string;
    facets: Limiters;
  };
};

type FacetDTO = {
  totalRecords: number;
  values: {
    id: string;
    totalRecords: number;
  }[];
};

type FacetsDTO = Record<string, FacetDTO>;

type SourceEntry = {
  codes: string[];
  hridManagement: Record<string, any>;
  id: string;
  metadata: {
    createdByUserId: string;
    updatedByUserId: string;
    createdDate: string;
    updatedDate: string;
  };
  name: string;
  selectable: boolean;
  source: string;
  type: string;
  _version: number;
};

type SourceDataDTO = SourceEntry[];

type MarcPreviewMetadata = {
  baseId: string;
  marcId: string;
  srsId: string;
  title: string;
  headingType: string;
};

type FetchDataParams = {
  query: string;
  searchBy: SearchIdentifiers;
  offset?: number;
  selectedSegment?: string;
  baseQuerySelector?: SearchableIndexQuerySelectorType;
};
