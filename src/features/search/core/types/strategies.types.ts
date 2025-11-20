export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown> | string | FormData;
}

export interface RequestBuilder<TParams = Record<string, unknown>> {
  buildRequest(params: TParams): unknown;
}

export interface ResponseTransformer<TResponse = Record<string, unknown>, TResult = Record<string, unknown>> {
  transformResponse(response: TResponse): TResult;
}

export interface ResultFormatter<TResult = Record<string, unknown>, TFormatted = unknown> {
  formatResult(result: TResult): TFormatted;
}
