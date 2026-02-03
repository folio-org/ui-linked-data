import { ResourceType } from '@/common/constants/record.constants';

import { createRootEntry } from './resourceType.profile';

describe('resourceType.profile', () => {
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

    it('Creates root entry with correct structure for null input', () => {
      const result = createRootEntry(null);

      expect(result.type).toBe('profile');
      expect(result.displayName).toBe('Profile');
      expect(result.bfid).toBe('lde:Profile');
      expect(result.id).toBe('Profile');
      expect(Array.isArray(result.children)).toBe(true);
    });
  });
});
