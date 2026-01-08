import { hubLocalCheckService } from '../../../ui/services';
import type { IResultEnricher } from '../../types';

/**
 * Enriches Hub search results from Library of Congress with local availability data
 * Adds "isLocal" flag to raw hub entries before they are formatted
 */
export class HubsLocalAvailabilityEnricher implements IResultEnricher {
  async enrich<T>(rawData: T[]): Promise<T[]> {
    if (!rawData || rawData.length === 0) {
      return rawData;
    }

    const hubData = rawData as HubSearchResultDTO[];
    const tokens = hubData.map(hub => hub.token).filter(Boolean);

    if (tokens.length === 0) {
      return rawData;
    }

    const localHubIds = await hubLocalCheckService.checkLocalAvailability(tokens);

    const enrichedData = hubData.map(hub => ({
      ...hub,
      isLocal: localHubIds.has(hub.token),
    }));

    return enrichedData as T[];
  }
}
