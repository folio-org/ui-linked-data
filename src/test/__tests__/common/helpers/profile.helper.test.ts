import { ResourceType } from '@common/constants/record.constants';
import { getProfileConfig, getMappedResourceType } from '@common/helpers/profile.helper';

jest.mock('@/configs/resourceTypes', () => ({
  mapToResourceType: (value: string | null) => {
    if (value === 'work') return 'work';
    return 'instance';
  },
  getResourceTypeConfig: (type: string) => ({
    defaultProfileId: type === 'work' ? 1 : 2,
    profileChildren: ['Profile:Work', 'Profile:Instance'],
  }),
  createRootEntry: () => ({
    id: 'root',
    type: 'root',
  }),
}));

describe('profile.helper', () => {
  describe('getProfileConfig', () => {
    test('returns work profile configuration when ResourceType is work', () => {
      const result = getProfileConfig({ resourceType: ResourceType.work });

      expect(result).toEqual({
        ids: [1],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('returns instance profile configuration when ResourceType is instance', () => {
      const result = getProfileConfig({ resourceType: ResourceType.instance });

      expect(result).toEqual({
        ids: [2],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('Falls back to instance default when ResourceType is not specified', () => {
      const result = getProfileConfig({});

      expect(result).toEqual({
        ids: [2],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('uses provided profileId when ResourceType is instance', () => {
      const customProfileId = 42;
      const result = getProfileConfig({
        resourceType: ResourceType.instance,
        profileId: customProfileId,
      });

      expect(result).toEqual({
        ids: [Number(customProfileId)],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('uses provided referenceProfileId', () => {
      const customProfileId = 42;
      const referenceProfileId = '123';
      const result = getProfileConfig({
        resourceType: ResourceType.instance,
        profileId: customProfileId,
        referenceProfileId,
      });

      expect(result).toEqual({
        ids: [Number(customProfileId), referenceProfileId],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('uses default instance id when profileId is null and ResourceType is instance', () => {
      const result = getProfileConfig({
        resourceType: ResourceType.instance,
        profileId: null,
      });

      expect(result).toEqual({
        ids: [2],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('Uses profileId with instance fallback when ResourceType is not specified', () => {
      const customProfileId = 42;
      const result = getProfileConfig({
        profileId: customProfileId,
      });

      expect(result).toEqual({
        ids: [customProfileId],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });
  });

  describe('getMappedResourceType', () => {
    test('returns ResourceType.work when resourceTypeValue is "work"', () => {
      const result = getMappedResourceType('work');

      expect(result).toEqual(ResourceType.work);
    });

    test('returns ResourceType.instance when resourceTypeValue is "instance"', () => {
      const result = getMappedResourceType('instance');

      expect(result).toEqual(ResourceType.instance);
    });

    test('returns ResourceType.instance when resourceTypeValue is null', () => {
      const result = getMappedResourceType(null);

      expect(result).toEqual(ResourceType.instance);
    });

    test('returns ResourceType.instance when resourceTypeValue is any other string', () => {
      const result = getMappedResourceType('any-other-value');

      expect(result).toEqual(ResourceType.instance);
    });
  });
});
