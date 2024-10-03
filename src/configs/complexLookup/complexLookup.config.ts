import { SEARCH_API_ENDPOINT } from '@common/constants/api.constants';
import { SearchSegment } from '@common/constants/search.constants';
import { ComplexLookupType } from '@common/constants/complexLookup.constants';
import { COMPLEX_LOOKUP_FILTERS_CONFIG } from './complexLookupFilters.config';
import { COMPLEX_LOOKUP_SEARCH_BY_CONFIG } from './complexLookupSearchBy.config';

export const COMPLEX_LOOKUPS_CONFIG: ComplexLookupsConfig = {
  [ComplexLookupType.Authorities]: {
    api: {
      endpoints: {
        base: `${SEARCH_API_ENDPOINT}/authorities`,
        source: '/authority-source-files',
        facets: '/search/authorities/facets',
        bySearchSegment: {
          [SearchSegment.Search]: '/search/authorities',
          [SearchSegment.Browse]: '/browse/authorities',
        },
      },
      sourceKey: 'authoritySourceFiles',
      searchQuery: {
        filter: '(type <> "CONCEPT")',
        limit: 100,
      },
      results: {
        container: 'authorities'
      }
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
        },
        [SearchSegment.Browse]: {
          type: SearchSegment.Browse,
          labelId: 'ld.browse',
          isVisiblePaginationCount: false,
        },
      },
    },
    // For displaying "Search by" control and "Filters"
    searchBy: COMPLEX_LOOKUP_SEARCH_BY_CONFIG.authorities,
    filters: COMPLEX_LOOKUP_FILTERS_CONFIG.authorities,
    linkedField: 'subclass',
  },
};
