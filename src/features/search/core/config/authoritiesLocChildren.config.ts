import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';

import { AUTHORITIES_LOC_CHILDREN_SEARCHABLE_INDICES_MAP } from '../constants/authoritiesLocChildren.constants';
import { AuthoritiesSearchRequestBuilder } from '../strategies/requestBuilders';
import { AuthoritiesSearchResponseTransformer } from '../strategies/responseTransformers';
import { AuthoritiesSourceEnricher } from '../strategies/resultEnrichers';
import { MarcAuthoritiesPageResultFormatter } from '../strategies/resultFormatters';
import type { SearchTypeConfig } from '../types';

export const authoritiesLocChildrenConfig: SearchTypeConfig = {
  id: 'authorities:locChildren',

  strategies: {
    requestBuilder: new AuthoritiesSearchRequestBuilder(AUTHORITIES_LOC_CHILDREN_SEARCHABLE_INDICES_MAP),
    responseTransformer: new AuthoritiesSearchResponseTransformer(),
    resultFormatter: new MarcAuthoritiesPageResultFormatter(),
    resultEnricher: new AuthoritiesSourceEnricher(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.ChildrenSubjectHeading,
    query: '',
    limit: 100,
    offset: 0,
  },
};
