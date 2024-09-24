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

type ComplexLookupsConfigEntry = {
  api: {
    endpoints: {
      base: string;
      source?: string;
      facets?: string;
    };
    searchQuery: Record<string, string>;
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
