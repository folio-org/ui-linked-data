import { SearchableIndex as SearchableIndexEnum } from '@/common/constants/searchableIndex.constants';
import { HUB_SEARCHABLE_INDICES_MAP } from '@/features/complexLookup/configs';
import type { SearchTypeConfig } from '../types';
import { HubsLoCRequestBuilder } from '../strategies/requestBuilders';
import { HubResponseTransformer } from '../strategies/responseTransformers';
import { HubsResultFormatter } from '../strategies/resultFormatters';
import { HubsLocalAvailabilityEnricher } from '../strategies/resultEnrichers';

/**
 * Hubs Library Of Congress Configuration for Search page (Atomic)
 *
 * Search in Library Of Congress hub services.
 * Composite key: "hubs:libraryOfCongress"
 */
export const hubsLibraryOfCongressConfig: SearchTypeConfig = {
  id: 'hubs:libraryOfCongress',

  strategies: {
    requestBuilder: new HubsLoCRequestBuilder(HUB_SEARCHABLE_INDICES_MAP),
    responseTransformer: new HubResponseTransformer(),
    resultFormatter: new HubsResultFormatter(),
    resultEnricher: new HubsLocalAvailabilityEnricher(),
  },

  capabilities: {
    defaultLimit: 100,
    maxLimit: 100,
  },

  defaults: {
    searchBy: SearchableIndexEnum.HubNameKeyword,
    query: '',
    limit: 100, // API fetches 100 results
    offset: 0,
  },
};
