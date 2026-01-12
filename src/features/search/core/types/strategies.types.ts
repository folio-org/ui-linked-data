/**
 * Parameters for building a search request
 */
export interface SearchRequestParams {
  query: string;
  searchBy?: string; // undefined for advanced search (pre-formatted CQL query)
  source?: string;
  limit?: number;
  offset?: number;
  precedingRecordsCount?: number;
  sortBy?: string;
  selector?: 'query' | 'prev' | 'next'; // Browse pagination selector
}

/**
 * Output from request builder - maps directly to baseApi.getJson input
 */
export interface SearchRequestDescriptor {
  url: string;
  urlParams: Record<string, string>;
  sameOrigin: boolean;
}

/**
 * Normalized search results returned by response transformers
 */
export interface NormalizedSearchResult {
  content: unknown[];
  totalRecords: number;
  totalPages: number;
  prev?: string;
  next?: string;
}

/**
 * Request builder interface - builds requests for baseApi.getJson
 */
export interface IRequestBuilder {
  build(params: SearchRequestParams): SearchRequestDescriptor;
}

/**
 * Response transformer interface - transforms API responses to normalized format
 */
export interface IResponseTransformer {
  readonly resultsContainer?: string;
  transform(response: unknown, limit: number): NormalizedSearchResult;
}

/**
 * Result formatter interface - formats normalized results for UI display
 */
export interface IResultFormatter<TFormatted = unknown> {
  format(data: unknown[], sourceData?: unknown): TFormatted[];
}

/**
 * Result enricher interface - enriches formatted results with additional data
 * Executes after formatting, allows async operations like API calls
 */
export interface IResultEnricher {
  enrich<T>(formattedResults: T[]): Promise<T[]>;
}

/**
 * Search strategies container - holds strategy instances
 */
export interface SearchStrategies {
  requestBuilder?: IRequestBuilder;
  responseTransformer?: IResponseTransformer;
  resultFormatter?: IResultFormatter;
  resultEnricher?: IResultEnricher;
}
