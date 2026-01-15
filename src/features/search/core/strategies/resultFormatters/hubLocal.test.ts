import { LocalHubSearchResultDTO } from '../../types';
import { HubsLocalResultFormatter } from './hubLocal';

describe('HubsLocalResultFormatter', () => {
  let formatter: HubsLocalResultFormatter;

  beforeEach(() => {
    formatter = new HubsLocalResultFormatter();
  });

  describe('format', () => {
    it('Formats local hub with originalId as "Library of Congress, Local"', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: 'hub_1',
          tenantId: 'diku',
          originalId: 'loc-123456',
          label: 'Horse and hound bookazine series',
        },
      ];

      const result = formatter.format(mockData);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        __meta: {
          id: 'hub_1',
          isAnchor: false,
          isLocal: true,
        },
        hub: {
          label: 'Horse and hound bookazine series',
          uri: '',
          className: 'hub-title',
        },
        source: {
          label: 'ld.source.libraryOfCongress.local',
          className: 'hub-source',
        },
      });
      expect(result[0].__meta.key).toBeDefined();
    });

    it('Formats local hub without originalId as "Local"', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: 'hub_2',
          tenantId: 'diku',
          label: 'Locally created hub',
        },
      ];

      const result = formatter.format(mockData);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        __meta: {
          id: 'hub_2',
          isAnchor: false,
          isLocal: true,
        },
        hub: {
          label: 'Locally created hub',
          uri: '',
          className: 'hub-title',
        },
        source: {
          label: 'ld.source.local',
          className: 'hub-source',
        },
      });
    });

    it('Formats multiple hubs with mixed originalId values', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: 'hub_1',
          tenantId: 'diku',
          originalId: 'loc-1',
          label: 'LoC Hub',
        },
        {
          id: 'hub_2',
          tenantId: 'diku',
          label: 'Local Hub',
        },
        {
          id: 'hub_3',
          tenantId: 'diku',
          originalId: 'loc-3',
          label: 'Another LoC Hub',
        },
      ];

      const result = formatter.format(mockData);

      expect(result).toHaveLength(3);
      expect(result[0].source.label).toBe('ld.source.libraryOfCongress.local');
      expect(result[1].source.label).toBe('ld.source.local');
      expect(result[2].source.label).toBe('ld.source.libraryOfCongress.local');
    });

    it('Handles empty array', () => {
      const result = formatter.format([]);

      expect(result).toEqual([]);
    });

    it('Handles hub with empty label', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: 'hub_4',
          tenantId: 'diku',
          label: '',
        },
      ];

      const result = formatter.format(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].hub.label).toBe('');
    });

    it('Handles hub with empty id', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: '',
          tenantId: 'diku',
          label: 'Test Hub',
        },
      ];

      const result = formatter.format(mockData);

      expect(result).toHaveLength(1);
      expect(result[0].__meta.id).toBe('');
    });

    it('Sets isLocal to true for all results', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: 'hub_1',
          tenantId: 'diku',
          originalId: 'loc-1',
          label: 'Hub 1',
        },
        {
          id: 'hub_2',
          tenantId: 'diku',
          label: 'Hub 2',
        },
      ];

      const result = formatter.format(mockData);

      result.forEach(hub => {
        expect(hub.__meta.isLocal).toBe(true);
      });
    });

    it('Generates unique keys for each result', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: 'hub_1',
          tenantId: 'diku',
          label: 'Hub 1',
        },
        {
          id: 'hub_2',
          tenantId: 'diku',
          label: 'Hub 2',
        },
      ];

      const result = formatter.format(mockData);

      const keys = result.map(r => r.__meta.key);
      const uniqueKeys = new Set(keys);

      expect(uniqueKeys.size).toBe(keys.length);
    });

    it('Handles originalId with empty string as "Local"', () => {
      const mockData: LocalHubSearchResultDTO[] = [
        {
          id: 'hub_5',
          tenantId: 'diku',
          originalId: '',
          label: 'Test Hub',
        },
      ];

      const result = formatter.format(mockData);

      expect(result[0].source.label).toBe('ld.source.local');
    });
  });
});
