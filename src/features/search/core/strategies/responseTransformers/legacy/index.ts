import { TransformSearchResponseParams, transformSearchResponse } from './transformSearchResponse';

export * from './transformSearchResponse';

/**
 * @deprecated Use transformer classes (StandardResponseTransformer, HubResponseTransformer, etc.) instead.
 * This legacy registry is kept for backward compatibility with existing hooks.
 */
export const RESPONSE_TRANSFORMERS = {
  standard: (params: TransformSearchResponseParams) => transformSearchResponse({ ...params, apiType: 'standard' }),
  hub: (params: TransformSearchResponseParams) => transformSearchResponse({ ...params, apiType: 'hub' }),
};
