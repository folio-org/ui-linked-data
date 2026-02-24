import { deletePreferredProfile, savePreferredProfile } from '@/common/api/profiles.api';

import { determinePreferredAction, generateSettings } from './profileSave';

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

      const result = generateSettings(selectedComponents, unusedComponents, true);

      expect(result).toEqual({
        active: true,
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
