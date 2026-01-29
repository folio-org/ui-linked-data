import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

import * as BibframeConstants from '@/common/constants/bibframe.constants';
import { getLabelId, getWarningByProfileNames, isProfilePreferred } from '@/common/helpers/profileSelection.helper';

const mockBibframeConstants = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
mockBibframeConstants({ WORK: 'work_URL', INSTANCE: 'instance_URL' });

jest.mock('@/configs', () => ({
  profileWarningsByName: {
    work_URL: {
      'Serials Work': {
        Books: ['ld.field.typeOfContinuingResource'],
      },
      Books: {
        'Serials Work': ['ld.na'],
      },
    },
    instance_URL: {
      Monograph: {
        Serials: ['ld.na'],
        'Rare Books': ['ld.field.urlOfInstance'],
      },
      'Rare Books': {
        Monograph: ['ld.field.bookFormat'],
        Serials: ['ld.field.bookFormat'],
      },
      Serials: {
        Monograph: ['ld.field.frequency'],
        'Rare Books': ['ld.field.urlOfInstance', 'ld.field.frequency'],
      },
    },
  },
}));

describe('profileSelection.helper', () => {
  describe('getLabelId', () => {
    it('returns workSet label when action is set and resourceType is work', () => {
      const labels = {
        workSet: 'workSetLabel',
        instanceSet: 'instanceSetLabel',
        workChange: 'workChangeLabel',
        instanceChange: 'instanceChangeLabel',
        defaultLabel: 'defaultLabel',
      };
      const profileSelectionType = { action: 'set', resourceTypeURL: 'work_URL' as ResourceTypeURL } as const;

      const result = getLabelId({ labels, profileSelectionType });

      expect(result).toBe('workSetLabel');
    });

    it('returns instanceSet label when action is set and resourceType is instance', () => {
      const labels = {
        workSet: 'workSetLabel',
        instanceSet: 'instanceSetLabel',
        workChange: 'workChangeLabel',
        instanceChange: 'instanceChangeLabel',
        defaultLabel: 'defaultLabel',
      };
      const profileSelectionType = { action: 'set', resourceTypeURL: 'instance_URL' as ResourceTypeURL } as const;

      const result = getLabelId({ labels, profileSelectionType });

      expect(result).toBe('instanceSetLabel');
    });

    it('returns workChange label when action is change and resourceType is work', () => {
      const labels = {
        workSet: 'workSetLabel',
        instanceSet: 'instanceSetLabel',
        workChange: 'workChangeLabel',
        instanceChange: 'instanceChangeLabel',
        defaultLabel: 'defaultLabel',
      };
      const profileSelectionType = { action: 'change', resourceTypeURL: 'work_URL' as ResourceTypeURL } as const;

      const result = getLabelId({ labels, profileSelectionType });

      expect(result).toBe('workChangeLabel');
    });

    it('returns instanceChange label when action is change and resourceType is instance', () => {
      const labels = {
        workSet: 'workSetLabel',
        instanceSet: 'instanceSetLabel',
        workChange: 'workChangeLabel',
        instanceChange: 'instanceChangeLabel',
        defaultLabel: 'defaultLabel',
      };
      const profileSelectionType = { action: 'change', resourceTypeURL: 'instance_URL' as ResourceTypeURL } as const;

      const result = getLabelId({ labels, profileSelectionType });

      expect(result).toBe('instanceChangeLabel');
    });

    it('returns defaultLabel when action is not recognized', () => {
      const labels = {
        workSet: 'workSetLabel',
        instanceSet: 'instanceSetLabel',
        workChange: 'workChangeLabel',
        instanceChange: 'instanceChangeLabel',
        defaultLabel: 'defaultLabel',
      };
      const profileSelectionType = {
        action: 'unknown' as 'set',
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      } as const;

      const result = getLabelId({ labels, profileSelectionType });

      expect(result).toBe('defaultLabel');
    });
  });

  describe('getWarningByProfileNames', () => {
    it('returns warning messages when switching from Monograph to Serials for Instance', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Monograph', 'Serials');

      expect(result).toEqual(['ld.na']);
    });

    it('returns warning messages when switching from Monograph to Rare Books for Instance', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Monograph', 'Rare Books');

      expect(result).toEqual(['ld.field.urlOfInstance']);
    });

    it('returns warning messages when switching from Serials to Rare Books for Instance', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Serials', 'Rare Books');

      expect(result).toEqual(['ld.field.urlOfInstance', 'ld.field.frequency']);
    });

    it('returns warning messages when switching from Rare Books to Monograph for Instance', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Rare Books', 'Monograph');

      expect(result).toEqual(['ld.field.bookFormat']);
    });

    it('returns warning messages when switching from Rare Books to Serials for Instance', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Rare Books', 'Serials');

      expect(result).toEqual(['ld.field.bookFormat']);
    });

    it('returns warning messages when switching from Serials to Monograph for Instance', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Serials', 'Monograph');

      expect(result).toEqual(['ld.field.frequency']);
    });

    it('returns warning messages when switching from Serials to Books for Work', () => {
      const result = getWarningByProfileNames('work_URL' as ResourceTypeURL, 'Serials Work', 'Books');

      expect(result).toEqual(['ld.field.typeOfContinuingResource']);
    });

    it('returns warning messages when switching from Books to Serials for Work', () => {
      const result = getWarningByProfileNames('work_URL' as ResourceTypeURL, 'Books', 'Serials Work');

      expect(result).toEqual(['ld.na']);
    });

    it('returns null when there are no warnings for the profile combination', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Unknown', 'Serials');

      expect(result).toBeNull();
    });

    it('returns null when the from profile exists but the to profile does not have warnings', () => {
      const result = getWarningByProfileNames('instance_URL' as ResourceTypeURL, 'Monograph', 'Unknown');

      expect(result).toBeNull();
    });

    it('returns null when resourceTypeURL does not exist', () => {
      const result = getWarningByProfileNames('unknown_URL' as ResourceTypeURL, 'Monograph', 'Serials Work');

      expect(result).toBeNull();
    });
  });

  describe('isProfilePreferred', () => {
    const mockPreferredProfiles = [
      { id: '1', name: 'Test Profile 1', resourceType: 'work_URL' },
      { id: '2', name: 'Test Profile 2', resourceType: 'instance_URL' },
      { id: 3, name: 'Test Profile 3', resourceType: 'work_URL' },
    ] as ProfileDTO[];

    it('returns true when profile is in preferred profiles with matching resource type', () => {
      const result = isProfilePreferred({
        profileId: '1',
        preferredProfiles: mockPreferredProfiles,
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(result).toBe(true);
    });

    it('returns true when numeric profile ID matches preferred profile', () => {
      const result = isProfilePreferred({
        profileId: 3,
        preferredProfiles: mockPreferredProfiles,
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(result).toBe(true);
    });

    it('returns false when profile is in preferred profiles but resource type does not match', () => {
      const result = isProfilePreferred({
        profileId: '1',
        preferredProfiles: mockPreferredProfiles,
        resourceTypeURL: 'instance_URL' as ResourceTypeURL,
      });

      expect(result).toBe(false);
    });

    it('returns false when profile is not in preferred profiles', () => {
      const result = isProfilePreferred({
        profileId: '999',
        preferredProfiles: mockPreferredProfiles,
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(result).toBe(false);
    });

    it('returns false when preferredProfiles is undefined', () => {
      const result = isProfilePreferred({
        profileId: '1',
        preferredProfiles: undefined,
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(result).toBe(false);
    });

    it('returns false when resourceTypeURL is undefined', () => {
      const result = isProfilePreferred({
        profileId: '1',
        preferredProfiles: mockPreferredProfiles,
        resourceTypeURL: undefined,
      });

      expect(result).toBe(false);
    });

    it('returns false when preferredProfiles is empty array', () => {
      const result = isProfilePreferred({
        profileId: '1',
        preferredProfiles: [],
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(result).toBe(false);
    });

    it('handles string and number ID comparison correctly', () => {
      const profiles = [{ id: 123, name: 'Test', resourceType: 'work_URL' }] as ProfileDTO[];

      const resultWithStringId = isProfilePreferred({
        profileId: '123',
        preferredProfiles: profiles,
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      const resultWithNumericId = isProfilePreferred({
        profileId: 123,
        preferredProfiles: profiles,
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(resultWithStringId).toBe(true);
      expect(resultWithNumericId).toBe(true);
    });
  });
});
