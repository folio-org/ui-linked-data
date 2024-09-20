import { SEARCH_API_ENDPOINT } from './api.constants';
import { SearchSegment } from './search.constants';

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
          creator: 'marva.selectMARCAuthority',
          contributor: 'marva.selectMARCAuthority',
        },
        searchResults: 'marva.marcAuthority',
      },
    },
    // For displaying "Search by" control
    searchBy: {
      [SearchSegment.Search]: [
        {
          label: 'keyword',
          value: 'label',
        },
        {
          label: 'identifierAll',
          value: 'identifierAll',
        },
        {
          label: 'lccn',
          value: 'lccn',
        },
        {
          label: 'personalName',
          value: 'personalName',
        },
        {
          label: 'corporateName',
          value: 'corporateName',
        },
        {
          label: 'geographicName',
          value: 'geographicName',
        },
        {
          label: 'nameTitle',
          value: 'nameTitle',
        },
        {
          label: 'uniformTitle',
          value: 'uniformTitle',
        },
        {
          label: 'subject',
          value: 'subject',
        },
        {
          label: 'childrensSubjectHeading',
          value: 'childrensSubjectHeading',
        },
        {
          label: 'genre',
          value: 'genre',
        },
      ],
      [SearchSegment.Browse]: [
        {
          label: 'personalName',
          value: 'personalName',
        },
        {
          label: 'corporateName',
          value: 'corporateName',
        },
        {
          label: 'geographicName',
          value: 'geographicName',
        },
        {
          label: 'nameTitle',
          value: 'nameTitle',
        },
        {
          label: 'uniformTitle',
          value: 'uniformTitle',
        },
        {
          label: 'subject',
          value: 'subject',
        },
        {
          label: 'genre',
          value: 'genre',
        },
      ],
    },
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

export const EMPTY_LINKED_DROPDOWN_OPTION_SUFFIX = 'empty';
export const VALUE_DIVIDER = ' ,';
export const __MOCK_URI_CHANGE_WHEN_IMPLEMENTING = '__MOCK_URI_CHANGE_WHEN_IMPLEMENTING';
