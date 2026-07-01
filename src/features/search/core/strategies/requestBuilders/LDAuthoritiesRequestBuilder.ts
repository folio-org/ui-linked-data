import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';

import type { SearchRequestDescriptor, SearchRequestParams } from '../../types';
import { normalizeQuery } from '../../utils';
import { BaseRequestBuilder } from './BaseRequestBuilder';

export class LDAuthoritiesRequestBuilder extends BaseRequestBuilder {
  private readonly searchableIndicesMap?: SearchableIndicesMap;
  private readonly defaultSortBy: string;

  constructor(searchableIndicesMap?: SearchableIndicesMap, defaultSortBy = 'title') {
    super(SEARCH_API_ENDPOINT.AUTHORITIES_LOCAL, true);

    this.searchableIndicesMap = searchableIndicesMap;
    this.defaultSortBy = defaultSortBy;
  }

  build(params: SearchRequestParams): SearchRequestDescriptor {
    const { query, searchBy = 'keyword', limit, offset } = params;

    return {
      url: this.baseUrl,
      urlParams: {
        query: this.buildQuery(searchBy, query),
        ...this.buildPaginationParams(limit, offset),
      },
      sameOrigin: this.sameOrigin,
    };
  }

  private buildQuery(searchBy: string, value: string): string {
    const template = this.searchableIndicesMap?.search?.[searchBy as keyof SearchableIndexEntries]?.query;
    const sortClause = ` sortby ${this.defaultSortBy}`;

    if (typeof template === 'string') {
      return `${this.buildCqlFromTemplate(template, value)}${sortClause}`;
    }

    // Fallback for indices without a dedicated template (e.g. MARC-only options): label search
    const escapedValue = normalizeQuery(value) ?? '';

    return `(label all "${escapedValue}")${sortClause}`;
  }
}
