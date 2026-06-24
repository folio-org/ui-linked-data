import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from '@/common/constants/searchableIndices.constants';

import { AuthoritiesSearchRequestBuilder } from '../strategies/requestBuilders';
import { AuthoritiesSearchResponseTransformer } from '../strategies/responseTransformers';
import { MarcAuthoritiesPageResultFormatter } from '../strategies/resultFormatters';
import type { SearchTypeConfig } from '../types';

export const authoritiesMarcConfig: SearchTypeConfig = {
  id: 'authorities:marc',

  strategies: {
    requestBuilder: new AuthoritiesSearchRequestBuilder(COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP),
    responseTransformer: new AuthoritiesSearchResponseTransformer(),
    resultFormatter: new MarcAuthoritiesPageResultFormatter(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.Keyword,
    query: '',
    limit: 100,
    offset: 0,
  },
};
