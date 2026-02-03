import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';

import type { SearchRequestDescriptor, SearchRequestParams } from '../../types';
import { normalizeQuery } from '../../utils';
import { BaseRequestBuilder } from './BaseRequestBuilder';

export class AuthoritiesSearchRequestBuilder extends BaseRequestBuilder {
  private readonly searchableIndicesMap?: SearchableIndicesMap;

  constructor(searchableIndicesMap?: SearchableIndicesMap) {
    super(SEARCH_API_ENDPOINT.AUTHORITIES_SEARCH, true);

    this.searchableIndicesMap = searchableIndicesMap;
  }

  build(params: SearchRequestParams): SearchRequestDescriptor {
    const { query, searchBy = 'keyword', limit, offset } = params;
    const cqlQuery = this.buildQuery(searchBy, query);

    return {
      url: this.baseUrl,
      urlParams: {
        query: cqlQuery,
        ...this.buildPaginationParams(limit, offset),
      },
      sameOrigin: this.sameOrigin,
    };
  }

  private buildQuery(searchBy: string, value: string): string {
    const segmentMap = this.searchableIndicesMap?.search;
    const template = segmentMap?.[searchBy as keyof SearchableIndexEntries]?.query;

    if (typeof template === 'string') {
      return this.buildCqlFromTemplate(template, value);
    }

    const escapedValue = normalizeQuery(value) ?? '';

    return `(${searchBy} all "${escapedValue}")`;
  }
}
