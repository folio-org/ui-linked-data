import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';
import type { SearchRequestParams, SearchRequestDescriptor } from '../../types';
import { BaseRequestBuilder } from './BaseRequestBuilder';

export class HubsExternalRequestBuilder extends BaseRequestBuilder {
  private readonly searchableIndicesMap?: HubSearchableIndicesMap;

  constructor(searchableIndicesMap?: HubSearchableIndicesMap) {
    super(SEARCH_API_ENDPOINT.HUBS_EXTERNAL, false);

    this.searchableIndicesMap = searchableIndicesMap;
  }

  build(params: SearchRequestParams): SearchRequestDescriptor {
    const { query, searchBy = 'hubNameKeyword', limit, offset } = params;
    const queryParams = this.buildQueryParams(searchBy, query);

    return {
      url: this.baseUrl,
      urlParams: {
        ...queryParams,
        ...this.buildHubPaginationParams(limit, offset),
      },
      sameOrigin: this.sameOrigin,
    };
  }

  private buildQueryParams(searchBy: string, value: string): Record<string, string> {
    const indexConfig = this.searchableIndicesMap?.[searchBy as keyof HubSearchableIndicesMap];
    const config = indexConfig?.query;

    if (typeof config === 'object' && config !== null) {
      return {
        [config.paramName]: value,
        ...config.additionalParams,
      };
    }

    // Default fallback
    return { q: value };
  }

  /**
   * Hubs use 'count' instead of 'limit' for pagination
   */
  private buildHubPaginationParams(limit?: number, offset?: number): Record<string, string> {
    const params: Record<string, string> = {
      count: String(limit ?? 100),
    };

    if (offset !== undefined && offset > 0) {
      params.offset = String(offset);
    }

    return params;
  }
}
