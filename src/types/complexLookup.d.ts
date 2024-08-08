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
  labels: ComplexLookupLabels;
  linkedFields?: string[];
  searchBy: ComplexLookupSearchBy[];
  customFields: Record<string, { label: string }>;
  searchQuery: Record<string, string>;
};

type ComplexLookupsConfig = Record<string, ComplexLookupsConfigEntry>;
