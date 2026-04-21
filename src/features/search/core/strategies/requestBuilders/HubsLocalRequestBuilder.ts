import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import { SearchableIndex } from '@/common/constants/searchableIndex.constants';

import type { SearchRequestDescriptor, SearchRequestParams } from '../../types';
import { BaseRequestBuilder } from './BaseRequestBuilder';

export class HubsLocalRequestBuilder extends BaseRequestBuilder {
  private readonly searchableIndicesMap?: HubSearchableIndicesMap;

  constructor(searchableIndicesMap?: HubSearchableIndicesMap) {
    super(SEARCH_API_ENDPOINT.HUBS_LOCAL, true);

    this.searchableIndicesMap = searchableIndicesMap;
  }

  build(params: SearchRequestParams): SearchRequestDescriptor {
    const { query, searchBy = SearchableIndex.HubNameKeyword, limit, offset } = params;
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
    const indexConfig = this.searchableIndicesMap?.[searchBy as keyof HubSearchableIndicesMap];
    const config = indexConfig?.query;

    if (typeof config === 'object' && config !== null) {
      return `${config.paramName}="${value}"`;
    }

    // Default fallback for label search
    return `label="${value}"`;
  }
}
