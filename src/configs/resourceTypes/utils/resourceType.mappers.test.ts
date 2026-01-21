import { ResourceType } from '@/common/constants/record.constants';
import { mapToResourceType, mapUriToResourceType, resolveResourceType } from './resourceType.mappers';

describe('resourceType.mappers', () => {
  describe('mapToResourceType', () => {
    it('Maps "work" string to ResourceType.work', () => {
      expect(mapToResourceType('work')).toBe(ResourceType.work);
    });

    it('Maps "instance" string to ResourceType.instance', () => {
      expect(mapToResourceType('instance')).toBe(ResourceType.instance);
    });

    it('Maps uppercase "WORK" to ResourceType.work', () => {
      expect(mapToResourceType('WORK')).toBe(ResourceType.work);
    });

    it('Maps mixed case "Instance" to ResourceType.instance', () => {
      expect(mapToResourceType('Instance')).toBe(ResourceType.instance);
    });

    it('Trims whitespace and maps correctly', () => {
      expect(mapToResourceType('  work  ')).toBe(ResourceType.work);
    });

    it('Falls back to instance for null', () => {
      expect(mapToResourceType(null)).toBe(ResourceType.instance);
    });

    it('Falls back to instance for undefined', () => {
      expect(mapToResourceType(undefined)).toBe(ResourceType.instance);
    });

    it('Falls back to instance for empty string', () => {
      expect(mapToResourceType('')).toBe(ResourceType.instance);
    });

    it('Falls back to instance for unknown value', () => {
      expect(mapToResourceType('unknown_type')).toBe(ResourceType.instance);
    });

    it('Maps "hub" string to ResourceType.hub', () => {
      expect(mapToResourceType('hub')).toBe(ResourceType.hub);
    });
  });

  describe('mapUriToResourceType', () => {
    it('Maps work URI to ResourceType.work', () => {
      const uri = 'http://bibfra.me/vocab/lite/Work';

      expect(mapUriToResourceType(uri)).toBe(ResourceType.work);
    });

    it('Maps instance URI to ResourceType.instance', () => {
      const uri = 'http://bibfra.me/vocab/lite/Instance';

      expect(mapUriToResourceType(uri)).toBe(ResourceType.instance);
    });

    it('Returns undefined for null', () => {
      expect(mapUriToResourceType(null)).toBeUndefined();
    });

    it('Returns undefined for undefined', () => {
      expect(mapUriToResourceType(undefined)).toBeUndefined();
    });

    it('Returns undefined for unknown URI', () => {
      expect(mapUriToResourceType('http://unknown.uri')).toBeUndefined();
    });
  });

  describe('resolveResourceType', () => {
    it('Prioritizes URI mapping over type parameter', () => {
      const workUri = 'http://bibfra.me/vocab/lite/Work';
      const result = resolveResourceType(workUri, 'instance');

      expect(result).toBe(ResourceType.work);
    });

    it('Falls back to type parameter when URI is null', () => {
      const result = resolveResourceType(null, 'work');

      expect(result).toBe(ResourceType.work);
    });

    it('Falls back to type parameter when URI is unknown', () => {
      const result = resolveResourceType('http://unknown.uri', 'work');

      expect(result).toBe(ResourceType.work);
    });

    it('Returns instance as default when both are null', () => {
      const result = resolveResourceType(null, null);

      expect(result).toBe(ResourceType.instance);
    });

    it('Returns instance as default when both are undefined', () => {
      const result = resolveResourceType(undefined, undefined);

      expect(result).toBe(ResourceType.instance);
    });

    it('Resolves from instance URI correctly', () => {
      const instanceUri = 'http://bibfra.me/vocab/lite/Instance';
      const result = resolveResourceType(instanceUri, null);

      expect(result).toBe(ResourceType.instance);
    });
  });
});
