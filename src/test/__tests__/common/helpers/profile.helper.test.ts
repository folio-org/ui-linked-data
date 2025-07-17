import { ResourceType } from '@common/constants/record.constants';
import { getProfileConfig } from '@common/helpers/profile.helper';

jest.mock('@src/configs', () => ({
  PROFILES_CONFIG: {
    Monograph: {
      api: {
        work: 1,
        instance: 2,
        profile: 3,
      },
      rootEntry: {
        id: 'root',
        type: 'root',
      },
    },
  },
}));

describe('profile.helper', () => {
  describe('getProfileConfig', () => {
    test('returns work profile configuration when ResourceType is work', () => {
      const result = getProfileConfig({ profileName: 'Monograph', resourceType: ResourceType.work });

      expect(result).toEqual({
        ids: [1],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('returns work and instance profile configuration when ResourceType is instance', () => {
      const result = getProfileConfig({ profileName: 'Monograph', resourceType: ResourceType.instance });

      expect(result).toEqual({
        ids: [1, 2],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('returns profile configuration when ResourceType is not work or instance', () => {
      const result = getProfileConfig({ profileName: 'Monograph' });

      expect(result).toEqual({
        ids: [3],
        rootEntry: {
          id: 'root',
          type: 'root',
        },
      });
    });

    test('throws error when profile does not exist in configuration', () => {
      expect(() => {
        getProfileConfig({ profileName: 'non-existent-profile' as any, resourceType: ResourceType.work });
      }).toThrow('Profile with ID non-existent-profile does not exist in the configuration.');
    });
  });
});
