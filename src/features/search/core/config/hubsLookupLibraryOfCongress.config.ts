import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import { HUB_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import type { SearchTypeConfig } from '../types';
import { HubsLoCRequestBuilder } from '../strategies/requestBuilders';
import { HubResponseTransformer } from '../strategies/responseTransformers';
import { HubsLookupResultFormatter } from '../strategies/resultFormatters';

/**
 * Hubs Library Of Congress Configuration for Complex Lookup modal (Atomic)
 *
 * Search in Library Of Congress hub services.
 * Composite key: "hubsLookup:libraryOfCongress"
 */
export const hubsLookupLibraryOfCongressConfig: SearchTypeConfig = {
  id: 'hubsLookup:libraryOfCongress',

  strategies: {
    requestBuilder: new HubsLoCRequestBuilder(HUB_SEARCHABLE_INDICES_MAP),
    responseTransformer: new HubResponseTransformer(),
    resultFormatter: new HubsLookupResultFormatter(),
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
  },
};
