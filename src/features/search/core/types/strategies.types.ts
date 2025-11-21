export interface RequestBuilder<TParams = Record<string, unknown>> {
  build(params: TParams): unknown;
}

export interface ResponseTransformer<TResponse = Record<string, unknown>, TResult = Record<string, unknown>> {
  transform(response: TResponse): TResult;
}

export interface ResultFormatter<TResult = Record<string, unknown>, TFormatted = unknown> {
  format(result: TResult): TFormatted;
}

// Search strategies container
export interface SearchStrategies {
  requestBuilder?: RequestBuilder;
  responseTransformer?: ResponseTransformer;
  resultFormatter?: ResultFormatter;
}
