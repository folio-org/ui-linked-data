import { HubsResultFormatter } from './hub';

describe('HubsResultFormatter', () => {
  let formatter: HubsResultFormatter;

  beforeEach(() => {
    formatter = new HubsResultFormatter();
  });

  describe('format', () => {
    it('returns empty array when data is empty', () => {
      const result = formatter.format([]);

      expect(result).toEqual([]);
    });

    it('formats hub entries with basic data', () => {
      const mockHubData = [
        {
          suggestLabel: 'Test Hub',
          uri: 'http://example.com/hub_1',
          token: 'token_123',
        },
      ] as HubSearchResultDTO[];

      const result = formatter.format(mockHubData);

      expect(result).toHaveLength(1);
      expect(result[0].__meta.id).toBe('token_123');
      expect(result[0].__meta.key).toBeDefined();
      expect(result[0].__meta.isAnchor).toBe(false);
      expect(result[0].__meta.isLocal).toBe(false);
      expect(result[0].hub.label).toBe('Test Hub');
      expect(result[0].hub.uri).toBe('http://example.com/hub_1');
      expect(result[0].hub.className).toBe('hub-title');
      expect(result[0].source.label).toBe('ld.source.libraryOfCongress');
      expect(result[0].source.className).toBe('hub-source');
    });

    it('formats hub entries with isLocal flag set to true', () => {
      const mockHubData = [
        {
          suggestLabel: 'Local Hub',
          uri: 'http://example.com/hub_1',
          token: 'token_123',
          isLocal: true,
        },
      ] as (HubSearchResultDTO & { isLocal: boolean })[];

      const result = formatter.format(mockHubData);

      expect(result[0].__meta.isLocal).toBe(true);
      expect(result[0].source.label).toBe('ld.source.libraryOfCongress.local');
    });

    it('formats hub entries with isLocal flag set to false', () => {
      const mockHubData = [
        {
          suggestLabel: 'Remote Hub',
          uri: 'http://example.com/hub_1',
          token: 'token_123',
          isLocal: false,
        },
      ] as (HubSearchResultDTO & { isLocal: boolean })[];

      const result = formatter.format(mockHubData);

      expect(result[0].__meta.isLocal).toBe(false);
      expect(result[0].source.label).toBe('ld.source.libraryOfCongress');
    });

    it('handles missing optional fields', () => {
      const mockHubData = [
        {
          suggestLabel: '',
          uri: '',
          token: '',
        },
      ] as HubSearchResultDTO[];

      const result = formatter.format(mockHubData);

      expect(result).toHaveLength(1);
      expect(result[0].hub.label).toBe('');
      expect(result[0].hub.uri).toBe('');
      expect(result[0].__meta.id).toBe('');
    });

    it('formats multiple hub entries correctly', () => {
      const mockHubData = [
        {
          suggestLabel: 'Hub 1',
          uri: 'http://example.com/hub_1',
          token: 'token_1',
        },
        {
          suggestLabel: 'Hub 2',
          uri: 'http://example.com/hub_2',
          token: 'token_2',
        },
        {
          suggestLabel: 'Hub 3',
          uri: 'http://example.com/hub_3',
          token: 'token_3',
        },
      ] as HubSearchResultDTO[];

      const result = formatter.format(mockHubData);

      expect(result).toHaveLength(3);
      expect(result[0].__meta.id).toBe('token_1');
      expect(result[1].__meta.id).toBe('token_2');
      expect(result[2].__meta.id).toBe('token_3');
    });

    it('generates unique keys for each entry', () => {
      const mockHubData = [
        {
          suggestLabel: 'Hub 1',
          uri: 'http://example.com/hub_1',
          token: 'token_1',
        },
        {
          suggestLabel: 'Hub 2',
          uri: 'http://example.com/hub_2',
          token: 'token_2',
        },
      ] as HubSearchResultDTO[];

      const result = formatter.format(mockHubData);

      expect(result[0].__meta.key).not.toBe(result[1].__meta.key);
    });
  });
});
