import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import type { SearchRequestParams, SearchRequestDescriptor } from '../../types';
import { normalizeQuery } from '../../utils';
import { BaseRequestBuilder } from './BaseRequestBuilder';

export class ResourcesRequestBuilder extends BaseRequestBuilder {
  private readonly defaultSortBy: string;

  constructor(defaultSortBy = 'title') {
    super(SEARCH_API_ENDPOINT.RESOURCES, true);
    this.defaultSortBy = defaultSortBy;
  }

  build(params: SearchRequestParams): SearchRequestDescriptor {
    const { query, searchBy, limit, offset, sortBy } = params;
    const cqlQuery = this.buildCqlQuery(query, searchBy, sortBy);

    return {
      url: this.baseUrl,
      urlParams: {
        query: cqlQuery,
        ...this.buildPaginationParams(limit, offset),
      },
      sameOrigin: this.sameOrigin,
    };
  }

  private buildCqlQuery(query: string, searchBy?: string, sortBy?: string): string {
    const sortClause = ` sortby ${sortBy ?? this.defaultSortBy}`;

    if (searchBy) {
      const escapedQuery = normalizeQuery(query) ?? '';

      return `(${searchBy} all "${escapedQuery}")${sortClause}`;
    }

    // Advanced search: query is already CQL formatted, just add sortby
    return `${query}${sortClause}`;
  }
}
