import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';

import { LDAuthoritiesRequestBuilder } from '../strategies/requestBuilders';
import { LDAuthoritiesResponseTransformer } from '../strategies/responseTransformers';
import { LDAuthoritiesResultFormatter } from '../strategies/resultFormatters';
import type { SearchTypeConfig } from '../types';

export const authoritiesLDConfig: SearchTypeConfig = {
  id: 'authorities:ld',

  strategies: {
    requestBuilder: new LDAuthoritiesRequestBuilder(),
    responseTransformer: new LDAuthoritiesResponseTransformer(),
    resultFormatter: new LDAuthoritiesResultFormatter(),
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
