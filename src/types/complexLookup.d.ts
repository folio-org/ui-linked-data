type SearchableIndexType = import('@common/constants/complexLookup.constants').SearchableIndex;
type SearchableIndexQuerySelectorType =
  import('@common/constants/complexLookup.constants').SearchableIndexQuerySelector;
type AuthorityValidationTargetType = import('@common/constants/complexLookup.constants').AuthorityValidationTarget;

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
  };
  results: {
    containers: {
      [key in SearchSegment]: string;
    };
  };
};

type SearchableIndexEntry = {
  [key in SearchableIndexQuerySelectorType]?: string;
};

type SearchableIndexEntries = {
  [key in SearchableIndexType]?: SearchableIndexEntry;
};

type SearchableIndicesMap = {
  [key in SearchSegmentValue]: SearchableIndexEntries;
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
  searchBy: ComplexLookupSearchBy | ComplexLookupSearchByValue;
  searchableIndicesMap: SearchableIndicesMap;
  filters?: SearchFilters;
};

type ComplexLookupsConfig = Record<string, ComplexLookupsConfigEntry>;

type ComplexLookupAssignRecordDTO = {
  id: string;
  title: string;
  linkedFieldValue?: string;
};

type BuildSearchQueryParams = {
  map: SearchableIndexEntries;
  selector?: SearchableIndexQuerySelectorType;
  searchBy: SearchableIndexType;
  value: string;
};
