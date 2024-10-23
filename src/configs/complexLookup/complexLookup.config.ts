import { SearchSegment } from '@common/constants/search.constants';
import { ComplexLookupType, SearchableIndex } from '@common/constants/complexLookup.constants';
import { COMPLEX_LOOKUP_FILTERS_CONFIG } from './complexLookupFilters.config';
import { COMPLEX_LOOKUP_SEARCH_BY_CONFIG } from './complexLookupSearchBy.config';
import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from './complexLookupSeachableIndicesMap';

export const COMPLEX_LOOKUPS_CONFIG: ComplexLookupsConfig = {
  [ComplexLookupType.Authorities]: {
    api: {
      endpoints: {
        base: '/search/authorities',
        source: '/authority-source-files',
        facets: '/search/authorities/facets',
        bySearchSegment: {
          [SearchSegment.Search]: '/search/authorities',
          [SearchSegment.Browse]: '/browse/authorities',
        },
        marcPreview: '/source-storage/records/:recordId/formatted?idType=AUTHORITY',
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
        },
        [SearchSegment.Browse]: {
          type: SearchSegment.Browse,
          labelId: 'ld.browse',
          isVisiblePaginationCount: false,
          isVisibleSubLabel: false,
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
    linkedField: 'subclass',
  },
};
