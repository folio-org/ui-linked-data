import { hubLocalCheckService } from '../../../ui/services';
import { extractRowIds, enrichRowsWithLocalAvailability } from '../../../ui/utils';
import type { IResultEnricher } from '../../types';

/**
 * Enricher for Hub search results from Library of Congress
 * Checks which external hubs are available locally and adds "isLocal" flag
 */
export class HubsLocalAvailabilityEnricher implements IResultEnricher {
  async enrich<T>(formattedResults: T[]): Promise<T[]> {
    if (!formattedResults || formattedResults.length === 0) {
      return formattedResults;
    }

    const tokens = extractRowIds(formattedResults as SearchResultsTableRow[]);

    if (tokens.length === 0) {
      return formattedResults;
    }

    const localHubIds = await hubLocalCheckService.checkLocalAvailability(tokens);

    const enriched = enrichRowsWithLocalAvailability(formattedResults as SearchResultsTableRow[], localHubIds);

    return (enriched || formattedResults) as T[];
  }
}
