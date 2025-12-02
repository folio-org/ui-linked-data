import type { IResponseTransformer, NormalizedSearchResult } from '../../types';

export abstract class BaseResponseTransformer implements IResponseTransformer {
  readonly resultsContainer?: string;

  constructor(resultsContainer?: string) {
    this.resultsContainer = resultsContainer;
  }

  abstract transform(response: unknown, limit: number): NormalizedSearchResult;

  protected calculateTotalPages(totalRecords: number, limit: number): number {
    return Math.ceil(totalRecords / limit);
  }

  protected ensureArray(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
  }
}
