import type { NormalizedSearchResult } from '../../types';
import { BaseResponseTransformer } from './BaseResponseTransformer';

interface StandardApiResponse {
  content?: unknown[];
  totalRecords?: number;
  totalPages?: number;
  prev?: string;
  next?: string;
  [key: string]: unknown;
}

/**
 * Response transformer for standard FOLIO API responses.
 * Handles responses with content/totalRecords/totalPages structure.
 * Can extract results from a configurable container key.
 */
export class StandardResponseTransformer extends BaseResponseTransformer {
  constructor(resultsContainer?: string) {
    super(resultsContainer);
  }

  transform(response: unknown, limit: number): NormalizedSearchResult {
    const data = response as StandardApiResponse;

    const content = this.extractContent(data);
    const totalRecords = data.totalRecords ?? 0;

    return {
      content,
      totalRecords,
      totalPages: data.totalPages ?? this.calculateTotalPages(totalRecords, limit),
      prev: data.prev,
      next: data.next,
    };
  }

  private extractContent(data: StandardApiResponse): unknown[] {
    if (data.content) {
      return this.ensureArray(data.content);
    }

    if (this.resultsContainer && data[this.resultsContainer]) {
      return this.ensureArray(data[this.resultsContainer]);
    }

    return [];
  }
}
