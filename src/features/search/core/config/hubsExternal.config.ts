import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import { HUB_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import type { SearchTypeConfig } from '../types';
import { HubsExternalRequestBuilder } from '../strategies/requestBuilders';
import { HubResponseTransformer } from '../strategies/responseTransformers';
import { HubsResultFormatter } from '../strategies/resultFormatters';

/**
 * Hubs External Configuration (Atomic)
 *
 * Search in external hub services.
 * Composite key: "hubs:external"
 */
export const hubsExternalConfig: SearchTypeConfig = {
  id: 'hubs:external',

  strategies: {
    requestBuilder: new HubsExternalRequestBuilder(HUB_SEARCHABLE_INDICES_MAP),
    responseTransformer: new HubResponseTransformer(),
    resultFormatter: new HubsResultFormatter(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.HubNameLeftAnchored,
    query: '',
    limit: 100, // API fetches 100 results
    offset: 0,
    uiPageSize: 100, // UI shows all 100 results per page
  },
};
