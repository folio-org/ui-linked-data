import { authoritySourceService } from '../../services';
import type { IResultEnricher } from '../../types';

/**
 * Enriches MARC authority search results with the resolved source-file name.
 * Adds a `sourceName` field to each raw entry (mapped from `sourceFileId`)
 * before the results are formatted.
 */
export class AuthoritiesSourceEnricher implements IResultEnricher {
  async enrich<T>(rawData: T[]): Promise<T[]> {
    if (!rawData?.length) {
      return rawData;
    }

    const sourceMap = await authoritySourceService.getSourceMap();

    return rawData.map(entry => {
      const sourceFileId = (entry as AuthorityAsSearchResultDTO).sourceFileId ?? '';

      return { ...entry, sourceName: sourceMap.get(sourceFileId) };
    }) as T[];
  }
}
