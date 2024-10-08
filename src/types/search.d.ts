type SearchQueryParams = import('@common/constants/routes.constants').SearchQueryParams;
type SearchIdentifiers = import('@common/constants/search.constants').SearchIdentifiers;
type SearchSegmentValue = import('@common/constants/search.constants').SearchSegment;

type SearchParamsState = {
  [key in SearchQueryParams]?: string | number | SearchIdentifiers;
};

type NavigationSegment = {
  value?: string;
  set: Dispatch<SetStateAction<boolean>> | VoidFunction;
};

type SearchParams = {
  endpointUrl: string;
  endpointUrlsBySegments?: {
    [key in SearchSegment]: string;
  };
  primarySegments?: PrimarySegmentsConfig;
  searchFilter?: string;
  hasSearchParams: boolean;
  defaultSearchBy: SearchIdentifiers;
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
  labelEmptySearch?: string;
  classNameEmptyPlaceholder?: string;
  navigationSegment?: NavigationSegment;
  getSearchSourceData?: (url?: string) => Promise<void>;
  getSearchFacetsData?: (facet?: string, isOpen?: boolean) => Promise<void>;
  searchResultsLimit?: number;
  fetchSearchResults?: (params: any) => Promise<SearchResults>;
  searchResultsContainer?: string;
  hasMarcPreview?: boolean;
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
