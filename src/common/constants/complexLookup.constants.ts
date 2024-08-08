export const COMPLEX_LOOKUPS_CONFIG: ComplexLookupsConfig = {
  authorities: {
    labels: {
      button: {
        base: 'marva.assignAuthority',
        change: 'marva.change',
      },
      modal: {
        title: {
          creator: 'marva.searchCreatorAuthority',
          contributor: 'marva.searchCreatorAuthority',
        },
        searchResults: 'marva.authorities',
      },
    },
    // For displaying "Search by" control
    searchBy: [
      {
        label: 'keyword',
        value: 'label',
      },
    ],
    linkedFields: ['subclass'],
    customFields: {
      source: {
        label: 'marva.lcnaf',
      },
    },
    searchQuery: {
      filter: '(type <> "CONCEPT")',
    },
  },
};
