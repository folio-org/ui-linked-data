import { SEARCH_API_ENDPOINT } from '@common/constants/api.constants';
import { SearchSegment } from '@common/constants/search.constants';
import { COMPLEX_LOOKUP_FILTERS_CONFIG } from './complexLookupFilters.config';
import { COMPLEX_LOOKUP_SEARCH_BY_CONFIG } from './complexLookupSearchBy.config';
import { ComplexLookupType } from '@common/constants/complexLookup.constants';

export const COMPLEX_LOOKUPS_CONFIG: ComplexLookupsConfig = {
  [ComplexLookupType.Authorities]: {
    api: {
      endpoints: {
        base: `${SEARCH_API_ENDPOINT}/authorities`,
        source: '/authority-source-files',
        facets: '/search/authorities/facets',
        bySearchSegment: {
          [SearchSegment.Search]: `${SEARCH_API_ENDPOINT}/authorities`,
          [SearchSegment.Browse]: '/browse/authorities',
        },
      },
      sourceKey: 'authoritySourceFiles',
      searchQuery: {
        filter: '(type <> "CONCEPT")',
      },
    },
    segments: {
      primary: {
        [SearchSegment.Search]: {
          type: SearchSegment.Search,
          labelId: 'marva.search',
          isVisiblePaginationCount: true,
        },
        [SearchSegment.Browse]: {
          type: SearchSegment.Browse,
          labelId: 'marva.browse',
          isVisiblePaginationCount: true,
        },
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
    searchBy: COMPLEX_LOOKUP_SEARCH_BY_CONFIG.authorities,
    linkedField: 'subclass',
    filters: COMPLEX_LOOKUP_FILTERS_CONFIG.authorities,
  },
};
