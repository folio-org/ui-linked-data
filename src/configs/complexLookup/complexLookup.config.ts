import { SearchSegment } from '@common/constants/search.constants';
import {
  AuthorityValidationTarget,
  ComplexLookupType,
  SearchableIndex,
} from '@common/constants/complexLookup.constants';
import { AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT } from '@common/constants/api.constants';
import { COMPLEX_LOOKUP_FILTERS_CONFIG } from './complexLookupFilters.config';
import { COMPLEX_LOOKUP_SEARCH_BY_CONFIG } from './complexLookupSearchBy.config';
import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP, HUB_SEARCHABLE_INDICES_MAP } from './complexLookupSeachableIndicesMap';

const BASE_AUTHORITY_CONFIG = {
  api: {
    endpoints: {
      base: '/search/authorities',
      sameOrigin: true,
      source: '/authority-source-files',
      facets: '/search/authorities/facets',
      bySearchSegment: {
        [SearchSegment.Search]: '/search/authorities',
        [SearchSegment.Browse]: '/browse/authorities',
      },
      marcPreview: '/source-storage/records/:recordId/formatted?idType=AUTHORITY',
      validation: AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT,
    },
    validationTarget: {
      creator: AuthorityValidationTarget.CreatorOfWork,
    },
    sourceKey: 'authoritySourceFiles',
    searchQuery: {
      limit: 100,
      precedingRecordsCount: 5,
    },
    results: {
      containers: {
        [SearchSegment.Search]: 'authorities',
        [SearchSegment.Browse]: 'items',
      },
    },
  },
  labels: {
    button: {
      base: 'ld.assignAuthority',
      change: 'ld.change',
    },
    modal: {
      title: {
        creator: 'ld.selectMarcAuthority',
        contributor: 'ld.selectMarcAuthority',
      },
      searchResults: 'ld.marcAuthority',
    },
  },
  // For displaying "Search" and "Browse" segments
  segments: {
    primary: {
      [SearchSegment.Search]: {
        type: SearchSegment.Search,
        labelId: 'ld.search',
        isVisiblePaginationCount: true,
        isVisibleSubLabel: true,
        isLoopedPagination: false,
      },
      [SearchSegment.Browse]: {
        type: SearchSegment.Browse,
        labelId: 'ld.browse',
        isVisiblePaginationCount: false,
        isVisibleSubLabel: false,
        isLoopedPagination: true,
      },
    },
    defaultValues: {
      segment: SearchSegment.Browse,
      searchBy: SearchableIndex.PersonalName,
    },
  },
  // For displaying "Search by" control and "Filters"
  searchBy: COMPLEX_LOOKUP_SEARCH_BY_CONFIG.authorities,
  searchableIndicesMap: COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP,
  filters: COMPLEX_LOOKUP_FILTERS_CONFIG.authorities,
};

export const COMPLEX_LOOKUPS_CONFIG: ComplexLookupsConfig = {
  [ComplexLookupType.Authorities]: {
    ...BASE_AUTHORITY_CONFIG,
    linkedField: 'subclass',
  },
  [ComplexLookupType.AuthoritiesSubject]: {
    ...BASE_AUTHORITY_CONFIG,
    api: {
      ...BASE_AUTHORITY_CONFIG.api,
      validationTarget: {
        subject: AuthorityValidationTarget.SubjectOfWork,
      },
    },
    labels: {
      ...BASE_AUTHORITY_CONFIG.labels,
      modal: {
        ...BASE_AUTHORITY_CONFIG.labels.modal,
        title: {
          subject: 'ld.selectMarcAuthority',
        },
      },
    },
  },
  [ComplexLookupType.Hub]: {
    ...BASE_AUTHORITY_CONFIG,
    api: {
      endpoints: {
        base: 'https://id.loc.gov/resources/hubs/suggest2/',
        sameOrigin: false,
      },
      searchQuery: {
        limit: 100,
        precedingRecordsCount: 5,
        defaultValue: COMPLEX_LOOKUP_SEARCH_BY_CONFIG.hub[0].value,
      },
      results: {
        containers: {},
      },
    },
    segments: null,
    labels: {
      button: {
        base: 'ld.add',
        change: 'ld.change',
      },
      modal: {
        title: {
          hub: 'ld.hubs.assign',
        },
        searchResults: 'ld.hubs',
        emptySearch: 'ld.hubs.enterSearchQuery',
      },
    },
    searchBy: COMPLEX_LOOKUP_SEARCH_BY_CONFIG.hub,
    searchableIndicesMap: HUB_SEARCHABLE_INDICES_MAP,
  },
};
