import { SEARCH_QUERY_VALUE_PARAM } from '@/common/constants/search.constants';
import { MAX_LIMIT } from '@/common/constants/api.constants';
import type { IRequestBuilder, SearchRequestParams, SearchRequestDescriptor } from '../../types';

export abstract class BaseRequestBuilder implements IRequestBuilder {
  protected readonly baseUrl: string;
  protected readonly sameOrigin: boolean;

  constructor(baseUrl: string, sameOrigin = true) {
    this.baseUrl = baseUrl;
    this.sameOrigin = sameOrigin;
  }

  abstract build(params: SearchRequestParams): SearchRequestDescriptor;

  protected buildCqlFromTemplate(template: string, value: string): string {
    return template.replaceAll(SEARCH_QUERY_VALUE_PARAM, value);
  }

  protected buildPaginationParams(limit?: number, offset?: number, defaultLimit = MAX_LIMIT): Record<string, string> {
    const params: Record<string, string> = {
      limit: String(limit ?? defaultLimit),
    };

    if (offset !== undefined && offset > 0) {
      params.offset = String(offset);
    }

    return params;
  }
}
