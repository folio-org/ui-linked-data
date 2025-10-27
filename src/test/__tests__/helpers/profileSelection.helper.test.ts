import { getLabelId, getWarningByProfileNames, isProfilePreferred } from '@common/helpers/profileSelection.helper';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as BibframeConstants from '@common/constants/bibframe.constants';

const mockBibframeConstants = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
mockBibframeConstants({ WORK: 'work_URL', INSTANCE: 'instance_URL' });

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
    it('returns warning messages when switching from Monograph to Serials', () => {
      const result = getWarningByProfileNames('Monograph', 'Serials');

      expect(result).toEqual(['ld.na']);
    });

    it('returns warning messages when switching from Monograph to Rare Books', () => {
      const result = getWarningByProfileNames('Monograph', 'Rare Books');

      expect(result).toEqual(['ld.field.urlOfInstance']);
    });

    it('returns warning messages when switching from Serials to Rare Books', () => {
      const result = getWarningByProfileNames('Serials', 'Rare Books');

      expect(result).toEqual(['ld.field.urlOfInstance', 'ld.field.frequency']);
    });

    it('returns null when there are no warnings for the profile combination', () => {
      const result = getWarningByProfileNames('Unknown', 'Serials');

      expect(result).toBeNull();
    });

    it('returns null when the from profile exists but the to profile does not have warnings', () => {
      const result = getWarningByProfileNames('Monograph', 'Unknown');

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
