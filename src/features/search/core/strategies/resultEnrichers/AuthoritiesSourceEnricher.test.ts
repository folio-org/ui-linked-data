import { authoritySourceService } from '../../services';
import { AuthoritiesSourceEnricher } from './AuthoritiesSourceEnricher';

jest.mock('../../services', () => ({
  authoritySourceService: {
    getSourceMap: jest.fn(),
  },
}));

const mockAuthoritySourceService = authoritySourceService as jest.Mocked<typeof authoritySourceService>;

describe('AuthoritiesSourceEnricher', () => {
  let enricher: AuthoritiesSourceEnricher;

  beforeEach(() => {
    enricher = new AuthoritiesSourceEnricher();
  });

  describe('enrich', () => {
    it('returns empty array without calling the service when rawData is empty', async () => {
      const result = await enricher.enrich([]);

      expect(result).toEqual([]);
      expect(mockAuthoritySourceService.getSourceMap).not.toHaveBeenCalled();
    });

    it('returns data as-is without calling the service when rawData is null', async () => {
      const result = await enricher.enrich(null as unknown as AuthorityAsSearchResultDTO[]);

      expect(result).toBeNull();
      expect(mockAuthoritySourceService.getSourceMap).not.toHaveBeenCalled();
    });

    it('enriches entries with resolved source names', async () => {
      const rawData = [
        { id: '1', sourceFileId: 'src-1' },
        { id: '2', sourceFileId: 'src-2' },
      ] as AuthorityAsSearchResultDTO[];

      mockAuthoritySourceService.getSourceMap.mockResolvedValue(
        new Map([
          ['src-1', 'LC Name Authority File'],
          ['src-2', 'MeSH'],
        ]),
      );

      const result = await enricher.enrich(rawData);

      expect(result).toEqual([
        { id: '1', sourceFileId: 'src-1', sourceName: 'LC Name Authority File' },
        { id: '2', sourceFileId: 'src-2', sourceName: 'MeSH' },
      ]);
    });

    it('sets sourceName to undefined when sourceFileId is not in the map', async () => {
      const rawData = [{ id: '1', sourceFileId: 'unknown-src' }] as AuthorityAsSearchResultDTO[];

      mockAuthoritySourceService.getSourceMap.mockResolvedValue(new Map([['src-1', 'LC Name Authority File']]));

      const result = await enricher.enrich(rawData);

      expect((result[0] as AuthorityAsSearchResultDTO & { sourceName?: string }).sourceName).toBeUndefined();
    });

    it('handles entries with missing sourceFileId', async () => {
      const rawData = [{ id: '1' }] as AuthorityAsSearchResultDTO[];

      mockAuthoritySourceService.getSourceMap.mockResolvedValue(new Map());

      const result = await enricher.enrich(rawData);

      expect(result).toHaveLength(1);
    });

    it('does not mutate the original entries', async () => {
      const entry = { id: '1', sourceFileId: 'src-1' } as AuthorityAsSearchResultDTO;
      const rawData = [entry];

      mockAuthoritySourceService.getSourceMap.mockResolvedValue(new Map([['src-1', 'LC Name']]));

      await enricher.enrich(rawData);

      expect(entry).not.toHaveProperty('sourceName');
    });
  });
});
