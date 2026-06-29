import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';

import { COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP } from '../constants';
import { AuthoritiesSearchRequestBuilder } from '../strategies/requestBuilders';
import { AuthoritiesSearchResponseTransformer } from '../strategies/responseTransformers';
import { AuthoritiesSourceEnricher } from '../strategies/resultEnrichers';
import { MarcAuthoritiesPageResultFormatter } from '../strategies/resultFormatters';
import type { SearchTypeConfig } from '../types';

export const authoritiesMarcConfig: SearchTypeConfig = {
  id: 'authorities:marc',

  strategies: {
    requestBuilder: new AuthoritiesSearchRequestBuilder(COMPLEX_LOOKUP_SEARCHABLE_INDICES_MAP),
    responseTransformer: new AuthoritiesSearchResponseTransformer(),
    resultFormatter: new MarcAuthoritiesPageResultFormatter(),
    resultEnricher: new AuthoritiesSourceEnricher(),
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
