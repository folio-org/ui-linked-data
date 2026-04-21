import { createUpdatedPreferredProfiles, getProfileNameById } from '@/common/helpers/profileActions.helper';

import { AvailableProfiles } from '@/store';

describe('profileActions.helper', () => {
  describe('getProfileNameById', () => {
    const mockResourceTypeURL = 'test-resource-type' as ResourceTypeURL;
    const mockProfileId = 'profile-123';
    const mockProfileName = 'Test Profile';

    const mockAvailableProfiles = {
      [mockResourceTypeURL]: [
        { id: 'profile-1', name: 'Profile 1', resourceType: mockResourceTypeURL },
        { id: mockProfileId, name: mockProfileName, resourceType: mockResourceTypeURL },
        { id: 'profile-3', name: 'Profile 3', resourceType: mockResourceTypeURL },
      ],
      ['other-resource-type' as ResourceTypeURL]: [
        { id: 'other-profile', name: 'Other Profile', resourceType: 'other-resource-type' },
      ],
    } as AvailableProfiles;

    test('returns profile name when profile exists', () => {
      const result = getProfileNameById({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: mockAvailableProfiles,
      });

      expect(result).toBe(mockProfileName);
    });

    test('returns empty string when profile does not exist', () => {
      const result = getProfileNameById({
        profileId: 'non-existent-profile',
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: mockAvailableProfiles,
      });

      expect(result).toBe('');
    });

    test('returns empty string when resourceTypeURL does not exist', () => {
      const result = getProfileNameById({
        profileId: mockProfileId,
        resourceTypeURL: 'non-existent-resource-type',
        availableProfiles: mockAvailableProfiles,
      });

      expect(result).toBe('');
    });

    test('returns empty string when availableProfiles is null', () => {
      const result = getProfileNameById({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: null,
      });

      expect(result).toBe('');
    });

    test('returns empty string when availableProfiles is empty object', () => {
      const result = getProfileNameById({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: {} as AvailableProfiles,
      });

      expect(result).toBe('');
    });

    test('returns empty string when resource type array is empty', () => {
      const emptyAvailableProfiles = {
        [mockResourceTypeURL]: [],
      } as unknown as AvailableProfiles;

      const result = getProfileNameById({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: emptyAvailableProfiles,
      });

      expect(result).toBe('');
    });

    test('works with numeric profile IDs', () => {
      const numericId = 123;
      const mockAvailableProfilesWithNumericId = {
        [mockResourceTypeURL]: [{ id: numericId, name: 'Numeric Profile', resourceType: mockResourceTypeURL }],
      } as unknown as AvailableProfiles;

      const result = getProfileNameById({
        profileId: numericId,
        resourceTypeURL: mockResourceTypeURL,
        availableProfiles: mockAvailableProfilesWithNumericId,
      });

      expect(result).toBe('Numeric Profile');
    });
  });

  describe('createUpdatedPreferredProfiles', () => {
    const mockProfileId = 'profile-123';
    const mockResourceTypeURL = 'test-resource-type';
    const mockProfileName = 'Test Profile';

    test('adds new profile when no preferred profiles exist', () => {
      const result = createUpdatedPreferredProfiles({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: null,
      });

      expect(result).toEqual([
        {
          id: mockProfileId,
          name: mockProfileName,
          resourceType: mockResourceTypeURL,
        },
      ]);
    });

    test('adds new profile when preferred profiles array is empty', () => {
      const result = createUpdatedPreferredProfiles({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: [],
      });

      expect(result).toEqual([
        {
          id: mockProfileId,
          name: mockProfileName,
          resourceType: mockResourceTypeURL,
        },
      ]);
    });

    test('adds new profile when no matching resource type exists', () => {
      const existingProfiles = [{ id: 'other-id', name: 'Other Profile', resourceType: 'other-resource-type' }];

      const result = createUpdatedPreferredProfiles({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: existingProfiles,
      });

      expect(result).toEqual([
        { id: 'other-id', name: 'Other Profile', resourceType: 'other-resource-type' },
        {
          id: mockProfileId,
          name: mockProfileName,
          resourceType: mockResourceTypeURL,
        },
      ]);
    });

    test('updates existing profile when resource type matches', () => {
      const existingProfiles = [
        { id: 'other-id', name: 'Other Profile', resourceType: 'other-resource-type' },
        { id: 'old-profile-id', name: 'Old Profile', resourceType: mockResourceTypeURL },
        { id: 'another-id', name: 'Another Profile', resourceType: 'another-resource-type' },
      ];

      const result = createUpdatedPreferredProfiles({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: existingProfiles,
      });

      expect(result).toEqual([
        { id: 'other-id', name: 'Other Profile', resourceType: 'other-resource-type' },
        {
          id: mockProfileId,
          name: mockProfileName,
          resourceType: mockResourceTypeURL,
        },
        { id: 'another-id', name: 'Another Profile', resourceType: 'another-resource-type' },
      ]);
    });

    test('does not mutate original array', () => {
      const originalProfiles = [{ id: 'existing-id', name: 'Existing Profile', resourceType: 'other-resource-type' }];
      const originalProfilesCopy = [...originalProfiles];

      const result = createUpdatedPreferredProfiles({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: originalProfiles,
      });

      // Original array should remain unchanged
      expect(originalProfiles).toEqual(originalProfilesCopy);
      // Result should be a new array
      expect(result).not.toBe(originalProfiles);
      expect(result).toHaveLength(2);
    });

    test('works with numeric profile IDs', () => {
      const numericId = 456;
      const result = createUpdatedPreferredProfiles({
        profileId: numericId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: [],
      });

      expect(result).toEqual([
        {
          id: numericId,
          name: mockProfileName,
          resourceType: mockResourceTypeURL,
        },
      ]);
    });

    test('handles empty profile name gracefully', () => {
      const result = createUpdatedPreferredProfiles({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: '',
        currentPreferredProfiles: [],
      });

      expect(result).toEqual([
        {
          id: mockProfileId,
          name: '',
          resourceType: mockResourceTypeURL,
        },
      ]);
    });

    test('updates the first matching resource type when multiple exist', () => {
      const existingProfiles = [
        { id: 'profile-1', name: 'Profile 1', resourceType: mockResourceTypeURL },
        { id: 'profile-2', name: 'Profile 2', resourceType: 'other-type' },
        { id: 'profile-3', name: 'Profile 3', resourceType: mockResourceTypeURL }, // This should NOT be updated
      ];

      const result = createUpdatedPreferredProfiles({
        profileId: mockProfileId,
        resourceTypeURL: mockResourceTypeURL,
        profileName: mockProfileName,
        currentPreferredProfiles: existingProfiles,
      });

      expect(result).toEqual([
        {
          id: mockProfileId,
          name: mockProfileName,
          resourceType: mockResourceTypeURL,
        },
        { id: 'profile-2', name: 'Profile 2', resourceType: 'other-type' },
        { id: 'profile-3', name: 'Profile 3', resourceType: mockResourceTypeURL },
      ]);
    });
  });
});
