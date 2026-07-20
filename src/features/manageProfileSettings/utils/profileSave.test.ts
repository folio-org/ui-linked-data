import { deletePreferredProfile, savePreferredProfile } from '@/common/api/profiles.api';
import { PROFILE_SETTINGS_DEFAULT_OPTION } from '@/common/constants/profileSettings.constants';

import { determinePreferredAction, determinePreferredSettingsAction, generateSettings } from './profileSave';

jest.mock('@/common/api/profiles.api', () => ({
  deletePreferredProfile: jest.fn(),
  savePreferredProfile: jest.fn(),
}));

describe('profileSave', () => {
  describe('determinePreferredAction', () => {
    it('skips saving preferred profile when none were set before and not selected', async () => {
      const selectedProfile = {
        id: 'select',
        name: 'Select',
        resourceType: 'irrelevant',
      };
      const preferredProfiles = [] as ProfileDTO[];

      const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, false);

      expect(preferredAction).toBeNull();
    });

    it('skips saving preferred profile when previously set to this and still selected', async () => {
      const selectedProfile = {
        id: 'prefer',
        name: 'prefer',
        resourceType: 'for-type',
      };
      const preferredProfiles = [
        {
          id: 'prefer',
          name: 'prefer',
          resourceType: 'for-type',
        },
      ] as ProfileDTO[];

      const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, true);

      expect(preferredAction).toBeNull();
    });

    it('skips saving preferred profile when previously set to another and not selected', async () => {
      const selectedProfile = {
        id: 'different',
        name: 'different',
        resourceType: 'for-type',
      };
      const preferredProfiles = [
        {
          id: 'prefer',
          name: 'prefer',
          resourceType: 'for-type',
        },
      ];

      const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, false);

      expect(preferredAction).toBeNull();
    });

    it('saves preferred profile when previously set to another and selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      const preferredProfiles = [
        {
          id: 'prefer',
          name: 'prefer',
          resourceType: 'for-type',
        },
      ];
      const selectedProfile = {
        id: 'another',
        name: 'another',
        resourceType: 'for-type',
      };

      const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, true);

      expect(preferredAction).not.toBeNull();
      if (preferredAction) {
        preferredAction(selectedProfile, preferredProfiles, jest.fn());

        expect(savePreferredProfile).toHaveBeenCalled();
        expect(deletePreferredProfile).not.toHaveBeenCalled();
      }
    });

    it('saves preferred profile when not previously set and selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      const preferredProfiles = [] as ProfileDTO[];
      const selectedProfile = {
        id: 'another',
        name: 'another',
        resourceType: 'for-type',
      };

      const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, true);

      expect(preferredAction).not.toBeNull();
      if (preferredAction) {
        preferredAction(selectedProfile, preferredProfiles, jest.fn());

        expect(savePreferredProfile).toHaveBeenCalled();
        expect(deletePreferredProfile).not.toHaveBeenCalled();
      }
    });

    it('deletes preferred profile when previously set to this and not selected', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      const preferredProfiles = [
        {
          id: 'prefer',
          name: 'prefer',
          resourceType: 'for-type',
        },
      ];
      const selectedProfile = {
        id: 'prefer',
        name: 'prefer',
        resourceType: 'for-type',
      };

      const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, false);

      expect(preferredAction).not.toBeNull();
      if (preferredAction) {
        preferredAction(selectedProfile, preferredProfiles, jest.fn());

        expect(savePreferredProfile).not.toHaveBeenCalled();
        expect(deletePreferredProfile).toHaveBeenCalled();
      }
    });

    it('deletes preferred profile when previously set to this and not selected while handling number and string ID discrepancy', async () => {
      (deletePreferredProfile as jest.Mock).mockResolvedValue({});
      (savePreferredProfile as jest.Mock).mockResolvedValue({});
      const preferredProfiles = [
        {
          id: '55',
          name: 'prefer',
          resourceType: 'for-type',
        },
      ];
      const selectedProfile = {
        id: 55,
        name: 'prefer',
        resourceType: 'for-type',
      };

      const preferredAction = determinePreferredAction(selectedProfile, preferredProfiles, false);

      expect(preferredAction).not.toBeNull();
      if (preferredAction) {
        preferredAction(selectedProfile, preferredProfiles, jest.fn());

        expect(savePreferredProfile).not.toHaveBeenCalled();
        expect(deletePreferredProfile).toHaveBeenCalled();
      }
    });
  });

  describe('determinePreferredSettingsAction', () => {
    const mockUpdate = jest.fn();
    const mockRemove = jest.fn();
    const mockProfileId = 100;
    const mockProfileSettingsId = 24;
    const mockPreferredProfileSettings = [
      {
        id: mockProfileSettingsId,
        profileId: mockProfileId,
        name: 'preferred',
      },
    ];

    it('skips any action when preferred profile settings remains the same', async () => {
      determinePreferredSettingsAction({
        profileId: mockProfileId,
        profileSettingsId: mockProfileSettingsId,
        preferredProfileSettings: mockPreferredProfileSettings,
        isPreferredProfileSettings: true,
        remove: mockRemove,
        update: mockUpdate,
      });

      expect(mockRemove).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('skips any action when no preferred profile settings and none set', async () => {
      determinePreferredSettingsAction({
        profileId: mockProfileId,
        profileSettingsId: mockProfileSettingsId,
        preferredProfileSettings: [],
        isPreferredProfileSettings: false,
        remove: mockRemove,
        update: mockUpdate,
      });

      expect(mockRemove).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('removes preferred profile setting when previously set but now unset', async () => {
      determinePreferredSettingsAction({
        profileId: mockProfileId,
        profileSettingsId: mockProfileSettingsId,
        preferredProfileSettings: mockPreferredProfileSettings,
        isPreferredProfileSettings: false,
        remove: mockRemove,
        update: mockUpdate,
      });

      expect(mockRemove).toHaveBeenCalledWith({ profileId: mockProfileId });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('removes preferred profile setting when trying to set to default', async () => {
      determinePreferredSettingsAction({
        profileId: mockProfileId,
        profileSettingsId: PROFILE_SETTINGS_DEFAULT_OPTION,
        preferredProfileSettings: mockPreferredProfileSettings,
        isPreferredProfileSettings: true,
        remove: mockRemove,
        update: mockUpdate,
      });

      expect(mockRemove).toHaveBeenCalledWith({ profileId: mockProfileId });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('updates preferred profile setting when given a new profile setting', async () => {
      const alternateProfileSettingsId = 846;
      determinePreferredSettingsAction({
        profileId: mockProfileId,
        profileSettingsId: alternateProfileSettingsId,
        preferredProfileSettings: mockPreferredProfileSettings,
        isPreferredProfileSettings: true,
        remove: mockRemove,
        update: mockUpdate,
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        profileId: mockProfileId,
        profileSettingsId: alternateProfileSettingsId,
      });
      expect(mockRemove).not.toHaveBeenCalled();
    });

    it('updates preferred profile setting when none previously set', async () => {
      determinePreferredSettingsAction({
        profileId: mockProfileId,
        profileSettingsId: mockProfileSettingsId,
        preferredProfileSettings: [],
        isPreferredProfileSettings: true,
        remove: mockRemove,
        update: mockUpdate,
      });

      expect(mockUpdate).toHaveBeenCalledWith({ profileId: mockProfileId, profileSettingsId: mockProfileSettingsId });
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });

  describe('generateSettings', () => {
    it('generates expected settings from selected and unused components', async () => {
      const unusedComponents = [
        {
          id: 'unused-1',
          name: 'unused-1',
          mandatory: false,
        },
      ];
      const selectedComponents = [
        {
          id: 'selected-1',
          name: 'selected-1',
          mandatory: true,
        },
        {
          id: 'selected-2',
          name: 'selected-2',
          mandatory: false,
        },
      ];

      const result = generateSettings(22, selectedComponents, unusedComponents, true, 'some-name');

      expect(result).toEqual({
        profileId: 22,
        active: true,
        name: 'some-name',
        children: [
          {
            id: 'selected-1',
            visible: true,
            order: 1,
          },
          {
            id: 'selected-2',
            visible: true,
            order: 2,
          },
          {
            id: 'unused-1',
            visible: false,
            order: 3,
          },
        ],
      });
    });
  });
});
