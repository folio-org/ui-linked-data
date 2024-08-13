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
    linkedField: 'subclass',
  },
};

export const COMPLEX_LOOKUPS_LINKED_FIELDS_MAPPING = {
  subclass: {
    PERSON: {
      bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Person',
      labelId: 'marva.person',
    },
    FAMILY: {
      bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Family',
      labelId: 'marva.family',
    },
    ORGANIZATION: {
      bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Organization',
      labelId: 'marva.organization',
    },
    MEETING: {
      bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Meeting',
      labelId: 'marva.meeting',
    },
    JURISDICTION: {
      bf2Uri: 'http://id.loc.gov/ontologies/bibframe/Jurisdiction',
      labelId: 'marva.jurisdiction',
    },
  },
};

export const EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX = 'empty'
