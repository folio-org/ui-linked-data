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
    endpoint: string;
    searchQuery: Record<string, string>;
  };
  labels: ComplexLookupLabels;
  linkedField?: string;
  searchBy: ComplexLookupSearchBy;
};

type ComplexLookupsConfig = Record<string, ComplexLookupsConfigEntry>;

type ComplexLookupAssignRecordDTO = {
  id: string;
  title: string;
  linkedFieldValue?: string;
};
