import { SEARCH_API_ENDPOINT } from './api.constants';

export const COMPLEX_LOOKUPS_CONFIG: ComplexLookupsConfig = {
  authorities: {
    api: {
      endpoint: `${SEARCH_API_ENDPOINT}/authorities`,
      searchQuery: {
        filter: '(type <> "CONCEPT")',
      },
    },
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
    // TODO: discuss if this value should be hardcoded
    // customFields: {
    //   source: {
    //     label: 'marva.lcnaf',
    //   },
    // },
  },
};
