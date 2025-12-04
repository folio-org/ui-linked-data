import type { NormalizedSearchResult } from '../../types';
import { BaseResponseTransformer } from './BaseResponseTransformer';

interface HubApiResponse {
  hits?: unknown[];
  count?: number;
}

export class HubResponseTransformer extends BaseResponseTransformer {
  transform(response: unknown, limit: number): NormalizedSearchResult {
    const data = response as HubApiResponse;

    const content = this.ensureArray(data.hits);
    const totalRecords = data.count ?? 0;

    return {
      content,
      totalRecords,
      totalPages: this.calculateTotalPages(totalRecords, limit),
      prev: undefined,
      next: undefined,
    };
  }
}
