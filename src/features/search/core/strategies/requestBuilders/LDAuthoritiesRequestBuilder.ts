import { SEARCH_API_ENDPOINT } from '@/common/constants/api.constants';

import { LD_AUTHORITY_TYPE_MAP } from '../../constants/ldAuthorityType.constants';
import type { SearchRequestDescriptor, SearchRequestParams } from '../../types';
import { normalizeQuery } from '../../utils';
import { BaseRequestBuilder } from './BaseRequestBuilder';

export class LDAuthoritiesRequestBuilder extends BaseRequestBuilder {
  private readonly defaultSortBy: string;

  constructor(defaultSortBy = 'title') {
    super(SEARCH_API_ENDPOINT.AUTHORITIES_LOCAL, true);
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
    const normalizedValue = normalizeQuery(value) ?? '';
    const sort = ` sortby ${this.defaultSortBy}`;

    if (searchBy === 'keyword') {
      return `(keyword all "${normalizedValue}")${sort}`;
    }

    if (searchBy === 'lccn' || searchBy === 'identifier') {
      return `(lccn all "${normalizedValue}")${sort}`;
    }

    const type = LD_AUTHORITY_TYPE_MAP[searchBy];

    if (type) {
      return `(type=="${type}" and label all "${normalizedValue}")${sort}`;
    }

    return `(label all "${normalizedValue}")${sort}`;
  }
}
