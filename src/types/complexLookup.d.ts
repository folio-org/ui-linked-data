type SearchableIndexType = import('@common/constants/complexLookup.constants').SearchableIndex;
type SearchableIndexQuerySelectorType =
  import('@common/constants/complexLookup.constants').SearchableIndexQuerySelector;

type ComplexLookupLabels = {
  button: {
    base: string;
    change: string;
  };
  modal: {
    title: Record<string, string>;
    searchResults: string;
  };
};

type ComplexLookupSearchBy = {
  [key in SearchSegment]: {
    label: string;
    value: string;
    isDisabled?: boolean;
  }[];
};

type SearchSegmentConfig = {
  type: SearchSegment;
  labelId: string;
  isVisiblePaginationCount?: boolean;
  isVisibleSubLabel?: boolean;
};

type PrimarySegmentsConfig = { [key in SearchSegment]: SearchSegmentConfig };

type ComplexLookupApiEntryConfig = {
  endpoints: {
    base: string;
    source?: string;
    facets?: string;
    bySearchSegment?: {
      [key in SearchSegment]: string;
    };
    marcPreview?: string;
  };
  sourceKey?: string;
  searchQuery: {
    filter?: string;
    limit?: number;
    precedingRecordsCount?: number;
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
    primary: PrimarySegmentsConfig;
    defaultValues?: {
      segment: SearchSegmentValue;
      searchBy: SearchableIndexType;
    };
  };
  labels: ComplexLookupLabels;
  linkedField?: string;
  searchBy: ComplexLookupSearchBy;
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
