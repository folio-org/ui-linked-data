import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import type { SearchRequestParams, SearchRequestDescriptor } from '../../types';
import { BaseRequestBuilder } from './BaseRequestBuilder';

export class AuthoritiesBrowseRequestBuilder extends BaseRequestBuilder {
  private readonly searchableIndicesMap?: SearchableIndicesMap;
  private readonly defaultPrecedingRecordsCount: number;

  constructor(searchableIndicesMap?: SearchableIndicesMap, precedingRecordsCount = 5) {
    super(SEARCH_API_ENDPOINT.AUTHORITIES_BROWSE, true);

    this.searchableIndicesMap = searchableIndicesMap;
    this.defaultPrecedingRecordsCount = precedingRecordsCount;
  }

  build(params: SearchRequestParams): SearchRequestDescriptor {
    const { query, searchBy = 'keyword', limit, offset, precedingRecordsCount } = params;
    const cqlQuery = this.buildQuery(searchBy, query);

    return {
      url: this.baseUrl,
      urlParams: {
        query: cqlQuery,
        ...this.buildPaginationParams(limit, offset),
        precedingRecordsCount: String(precedingRecordsCount ?? this.defaultPrecedingRecordsCount),
      },
      sameOrigin: this.sameOrigin,
    };
  }

  private buildQuery(searchBy: string, value: string, selector: 'query' | 'prev' | 'next' = 'query'): string {
    const segmentMap = this.searchableIndicesMap?.browse;
    const template = segmentMap?.[searchBy as keyof SearchableIndexEntries]?.[selector];

    if (typeof template === 'string') {
      return this.buildCqlFromTemplate(template, value);
    }

    // Fallback for browse
    return `(headingRef>="${value}" or headingRef<"${value}")`;
  }
}
