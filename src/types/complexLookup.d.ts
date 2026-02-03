type SearchableIndexType = import('@/common/constants/searchableIndex.constants').SearchableIndex;
type SearchableIndexQuerySelectorType =
  import('@/common/constants/searchableIndex.constants').SearchableIndexQuerySelector;
type AuthorityValidationTargetType =
  import('@/features/complexLookup/constants/complexLookup.constants').AuthorityValidationTarget;

type ComplexLookupLabels = {
  button: {
    base: string;
    change: string;
  };
  modal: {
    title: Record<string, string>;
    searchResults: string;
    emptySearch?: string;
  };
};

type ComplexLookupSearchByValue = {
  label: string;
  value: string;
  isDisabled?: boolean;
  placeholder?: string;
}[];

type ComplexLookupSearchBy = {
  [key in SearchSegment]: ComplexLookupSearchByValue;
};

type SearchSegmentConfig = {
  type: SearchSegment;
  labelId: string;
  isVisiblePaginationCount?: boolean;
  isVisibleSubLabel?: boolean;
  isLoopedPagination?: boolean;
};

type PrimarySegmentsConfig = { [key in SearchSegment]: SearchSegmentConfig };

type ComplexLookupApiEntryConfig = {
  endpoints: {
    base: string;
    sameOrigin?: boolean;
    source?: string;
    facets?: string;
    bySearchSegment?: {
      [key in SearchSegment]: string;
    };
    marcPreview?: string;
    validation?: string;
  };
  validationTarget?: Record<string, AuthorityValidationTargetType>;
  sourceKey?: string;
  searchQuery: {
    filter?: string;
    limit?: number;
    precedingRecordsCount?: number;
    defaultValue?: string;
    queryFormat?: 'string' | 'parameters';
  };
  results: {
    containers: {
      [key in SearchSegment]: string;
    };
    responseType?: 'standard' | 'hub';
  };
};

type SearchableIndexEntry = {
  [key in SearchableIndexQuerySelectorType]?: string | QueryParameterConfig;
};

type SearchableIndexEntries = {
  [key in SearchableIndexType]?: SearchableIndexEntry;
};

type SearchableIndicesMap = {
  [key in SearchSegmentValue]: SearchableIndexEntries;
};

type HubSearchableIndicesMap = {
  [key in SearchableIndexType]?: SearchableIndexEntry;
};

type ComplexLookupsConfigEntry = {
  api: ComplexLookupApiEntryConfig;
  segments: {
    primary?: PrimarySegmentsConfig;
    defaultValues?: {
      segment: SearchSegmentValue;
      searchBy: SearchableIndexType;
    };
  } | null;
  labels: ComplexLookupLabels;
  linkedField?: string;
  searchBy: {
    config: ComplexLookupSearchBy | ComplexLookupSearchByValue;
    defaultValue?: SearchableIndex;
  };
  searchableIndicesMap: SearchableIndicesMap | HubSearchableIndicesMap;
  filters?: SearchFilters;
  buildSearchQuery?: string;
  responseTransformer?: string;
  common: {
    hasMultilineSearchInput?: boolean;
  };
};

type ComplexLookupsConfig = Record<string, ComplexLookupsConfigEntry>;

type ComplexLookupAssignRecordDTO = {
  id: string;
  title: string;
  linkedFieldValue?: string;
  uri?: string;
  sourceType?: string;
};

type QueryParameterConfig = {
  paramName: string;
  additionalParams?: Record<string, string>;
  format?: 'string' | 'parameters';
};

type BuildSearchQueryResult = {
  queryType: 'string' | 'parameters';
  query: string;
  urlParams?: Record<string, string>;
};

type BuildSearchQueryParams = {
  map: SearchableIndexEntries | HubSearchableIndicesMap;
  selector?: SearchableIndexQuerySelectorType;
  searchBy: SearchableIndexType;
  value: string;
};
