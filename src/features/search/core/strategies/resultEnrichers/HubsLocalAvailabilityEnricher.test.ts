import { hubLocalCheckService } from '../../services';
import { HubsLocalAvailabilityEnricher } from './HubsLocalAvailabilityEnricher';

jest.mock('../../services', () => ({
  hubLocalCheckService: {
    checkLocalAvailability: jest.fn(),
  },
}));

const mockHubLocalCheckService = hubLocalCheckService as jest.Mocked<typeof hubLocalCheckService>;

describe('HubsLocalAvailabilityEnricher', () => {
  let enricher: HubsLocalAvailabilityEnricher;

  beforeEach(() => {
    enricher = new HubsLocalAvailabilityEnricher();
  });

  describe('enrich', () => {
    it('returns empty array when rawData is empty', async () => {
      const result = await enricher.enrich([]);

      expect(result).toEqual([]);
      expect(mockHubLocalCheckService.checkLocalAvailability).not.toHaveBeenCalled();
    });

    it('returns data as-is when rawData is null', async () => {
      const result = await enricher.enrich(null as unknown as HubSearchResultDTO[]);

      expect(result).toBeNull();
      expect(mockHubLocalCheckService.checkLocalAvailability).not.toHaveBeenCalled();
    });

    it('enriches hub data with isLocal flag and localId for local hubs', async () => {
      const rawData = [
        { token: 'token_1', suggestLabel: 'Hub 1', uri: 'uri_1' },
        { token: 'token_2', suggestLabel: 'Hub 2', uri: 'uri_2' },
      ] as HubSearchResultDTO[];

      mockHubLocalCheckService.checkLocalAvailability.mockResolvedValue(new Map([['token_1', 'id_1']]));

      const result = await enricher.enrich(rawData);

      expect(mockHubLocalCheckService.checkLocalAvailability).toHaveBeenCalledWith(['token_1', 'token_2']);
      expect(result).toEqual([
        { token: 'token_1', suggestLabel: 'Hub 1', uri: 'uri_1', isLocal: true, localId: 'id_1' },
        { token: 'token_2', suggestLabel: 'Hub 2', uri: 'uri_2', isLocal: false, localId: undefined },
      ]);
    });

    it('sets isLocal to false when hub is not in local availability map', async () => {
      const rawData = [
        { token: 'token_1', suggestLabel: 'Hub 1', uri: 'uri_1' },
        { token: 'token_2', suggestLabel: 'Hub 2', uri: 'uri_2' },
        { token: 'token_3', suggestLabel: 'Hub 3', uri: 'uri_3' },
      ] as HubSearchResultDTO[];

      mockHubLocalCheckService.checkLocalAvailability.mockResolvedValue(
        new Map([
          ['token_1', 'id_1'],
          ['token_3', 'id_3'],
        ]),
      );

      const result = await enricher.enrich(rawData);

      expect(result[0]).toMatchObject({ token: 'token_1', isLocal: true, localId: 'id_1' });
      expect(result[1]).toMatchObject({ token: 'token_2', isLocal: false, localId: undefined });
      expect(result[2]).toMatchObject({ token: 'token_3', isLocal: true, localId: 'id_3' });
    });

    it('filters out hubs without tokens before checking', async () => {
      const rawData = [
        { token: 'token_1', suggestLabel: 'Hub 1', uri: 'uri_1' },
        { token: '', suggestLabel: 'Hub 2', uri: 'uri_2' },
        { suggestLabel: 'Hub 3', uri: 'uri_3' },
      ] as HubSearchResultDTO[];

      mockHubLocalCheckService.checkLocalAvailability.mockResolvedValue(new Map([['token_1', 'id_1']]));

      await enricher.enrich(rawData);

      expect(mockHubLocalCheckService.checkLocalAvailability).toHaveBeenCalledWith(['token_1']);
    });

    it('returns original data when no tokens are present', async () => {
      const rawData = [
        { token: '', suggestLabel: 'Hub 1', uri: 'uri_1' },
        { suggestLabel: 'Hub 2', uri: 'uri_2' },
      ] as HubSearchResultDTO[];

      const result = await enricher.enrich(rawData);

      expect(result).toEqual(rawData);
      expect(mockHubLocalCheckService.checkLocalAvailability).not.toHaveBeenCalled();
    });

    it('handles empty local availability map', async () => {
      const rawData = [
        { token: 'token_1', suggestLabel: 'Hub 1', uri: 'uri_1' },
        { token: 'token_2', suggestLabel: 'Hub 2', uri: 'uri_2' },
      ] as HubSearchResultDTO[];

      mockHubLocalCheckService.checkLocalAvailability.mockResolvedValue(new Map());

      const result = await enricher.enrich(rawData);

      expect(result[0]).toMatchObject({ token: 'token_1', isLocal: false, localId: undefined });
      expect(result[1]).toMatchObject({ token: 'token_2', isLocal: false, localId: undefined });
    });
  });
});
