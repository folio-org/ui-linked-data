import { ResourceType } from '@/common/constants/record.constants';
import {
  getResourceTypeConfig,
  hasPreview,
  hasInstancesList,
  hasReference,
  getReference,
  getDefaultProfileId,
  getEditSectionPassiveClass,
  createRootEntry,
  mapToResourceType,
} from '@/configs/resourceTypes';

describe('resourceType.helpers', () => {
  describe('getResourceTypeConfig', () => {
    it('Returns config for work type', () => {
      const result = getResourceTypeConfig(ResourceType.work);

      expect(result.type).toBe(ResourceType.work);
      expect(result.profileBfid).toBe('lde:Profile:Work');
    });

    it('Returns config for instance type', () => {
      const result = getResourceTypeConfig(ResourceType.instance);

      expect(result.type).toBe(ResourceType.instance);
      expect(result.profileBfid).toBe('lde:Profile:Instance');
    });

    it('Falls back to instance for null', () => {
      const result = getResourceTypeConfig(null);

      expect(result.type).toBe(ResourceType.instance);
    });

    it('Falls back to instance for undefined', () => {
      const result = getResourceTypeConfig(undefined);

      expect(result.type).toBe(ResourceType.instance);
    });

    it('Falls back to instance for unknown string', () => {
      const result = getResourceTypeConfig('unknown_type');

      expect(result.type).toBe(ResourceType.instance);
    });
  });

  describe('hasPreview', () => {
    it('Returns true for work type', () => {
      expect(hasPreview(ResourceType.work)).toBe(true);
    });

    it('Returns true for instance type', () => {
      expect(hasPreview(ResourceType.instance)).toBe(true);
    });
  });

  describe('hasInstancesList', () => {
    it('Returns true for work type', () => {
      expect(hasInstancesList(ResourceType.work)).toBe(true);
    });

    it('Returns false for instance type', () => {
      expect(hasInstancesList(ResourceType.instance)).toBe(false);
    });
  });

  describe('hasReference', () => {
    it('Returns true for work type', () => {
      expect(hasReference(ResourceType.work)).toBe(true);
    });

    it('Returns true for instance type', () => {
      expect(hasReference(ResourceType.instance)).toBe(true);
    });
  });

  describe('getReference', () => {
    it('Returns reference for work type', () => {
      const result = getReference(ResourceType.work);

      expect(result).toEqual({
        key: '_instanceReference',
        uri: 'http://bibfra.me/vocab/lite/Instance',
        targetType: ResourceType.instance,
      });
    });

    it('Returns reference for instance type', () => {
      const result = getReference(ResourceType.instance);

      expect(result).toEqual({
        key: '_workReference',
        uri: 'http://bibfra.me/vocab/lite/Work',
        targetType: ResourceType.work,
      });
    });
  });

  describe('getDefaultProfileId', () => {
    it('Returns 2 for work type', () => {
      expect(getDefaultProfileId(ResourceType.work)).toBe(2);
    });

    it('Returns 3 for instance type', () => {
      expect(getDefaultProfileId(ResourceType.instance)).toBe(3);
    });
  });

  describe('getEditSectionPassiveClass', () => {
    it('Returns class name for work type', () => {
      expect(getEditSectionPassiveClass(ResourceType.work)).toBe('edit-section-passive');
    });

    it('Returns undefined for instance type', () => {
      expect(getEditSectionPassiveClass(ResourceType.instance)).toBeUndefined();
    });
  });

  describe('createRootEntry', () => {
    it('Creates root entry for work type', () => {
      const result = createRootEntry(ResourceType.work);

      expect(result).toEqual({
        type: 'profile',
        displayName: 'Profile',
        bfid: 'lde:Profile',
        children: ['Profile:Work', 'Profile:Instance'],
        id: 'Profile',
      });
    });

    it('Creates root entry for instance type', () => {
      const result = createRootEntry(ResourceType.instance);

      expect(result).toEqual({
        type: 'profile',
        displayName: 'Profile',
        bfid: 'lde:Profile',
        children: ['Profile:Work', 'Profile:Instance'],
        id: 'Profile',
      });
    });
  });

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
});
