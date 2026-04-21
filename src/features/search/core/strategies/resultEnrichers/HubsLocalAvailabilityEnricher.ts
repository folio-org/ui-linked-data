import { hubLocalCheckService } from '../../services';
import type { IResultEnricher } from '../../types';

/**
 * Enriches Hub search results from Library of Congress with local availability data
 * Adds "isLocal" flag to raw hub entries before they are formatted
 */
export class HubsLocalAvailabilityEnricher implements IResultEnricher {
  async enrich<T>(rawData: T[]): Promise<T[]> {
    if (!rawData?.length) {
      return rawData;
    }

    const hubData = rawData as HubSearchResultDTO[];
    const tokens = hubData.map(hub => hub.token).filter(Boolean);

    if (!tokens.length) {
      return rawData;
    }

    const localHubIdsMap = await hubLocalCheckService.checkLocalAvailability(tokens);

    const enrichedData = hubData.map(hub => {
      const localId = localHubIdsMap.get(hub.token);
      return {
        ...hub,
        isLocal: !!localId,
        localId,
      };
    });

    return enrichedData as T[];
  }
}
