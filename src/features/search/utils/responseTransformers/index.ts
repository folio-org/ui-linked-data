import { transformSearchResponse, TransformSearchResponseParams } from './responseTransformer';

export const RESPONSE_TRANSFORMERS = {
  standard: (params: TransformSearchResponseParams) => transformSearchResponse({ ...params, apiType: 'standard' }),
  hub: (params: TransformSearchResponseParams) => transformSearchResponse({ ...params, apiType: 'hub' }),
};
