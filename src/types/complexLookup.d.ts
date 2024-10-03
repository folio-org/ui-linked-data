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
  }[];
};

type SearchSegmentConfig = {
  type: SearchSegment;
  labelId: string;
  isVisiblePaginationCount?: boolean;
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
  };
  sourceKey?: string;
  searchQuery: {
    filter?: string;
    limit?: number;
  };
  results: {
    container: string;
  };
};

type ComplexLookupsConfigEntry = {
  api: ComplexLookupApiEntryConfig;
  segments: {
    primary: PrimarySegmentsConfig;
  };
  labels: ComplexLookupLabels;
  linkedField?: string;
  searchBy: ComplexLookupSearchBy;
  filters?: SearchFilters;
};

type ComplexLookupsConfig = Record<string, ComplexLookupsConfigEntry>;

type ComplexLookupAssignRecordDTO = {
  id: string;
  title: string;
  linkedFieldValue?: string;
};
