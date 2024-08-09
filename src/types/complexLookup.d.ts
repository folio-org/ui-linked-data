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
  label: string;
  value: string;
};

type ComplexLookupsConfigEntry = {
  api: {
    endpoint: string;
    searchQuery: Record<string, string>;
  };
  labels: ComplexLookupLabels;
  linkedFields?: string[];
  searchBy: ComplexLookupSearchBy[];
  // TODO: under discussion
  // customFields: Record<string, { label: string }>;
};

type ComplexLookupsConfig = Record<string, ComplexLookupsConfigEntry>;
