import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

import * as BibframeConstants from '@/common/constants/bibframe.constants';
import {
  getProfileSelectionMessageIds,
  getResourceTypeLabelId,
  getWarningByProfileNames,
  isProfilePreferred,
} from '@/common/helpers/profileSelection.helper';

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
  describe('getProfileSelectionMessageIds', () => {
    it('returns the create ids when action is set', () => {
      const result = getProfileSelectionMessageIds({
        action: 'set',
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(result).toEqual({ titleId: 'ld.newType', submitId: 'ld.create.base' });
    });

    it('returns the change ids when action is change', () => {
      const result = getProfileSelectionMessageIds({
        action: 'change',
        resourceTypeURL: 'instance_URL' as ResourceTypeURL,
      });

      expect(result).toEqual({ titleId: 'ld.changeTypeProfile', submitId: 'ld.change' });
    });
  });

  describe('getResourceTypeLabelId', () => {
    it('resolves the work label id from the work URL', () => {
      const result = getResourceTypeLabelId('http://bibfra.me/vocab/lite/Work' as ResourceTypeURL);

      expect(result).toBe('ld.work');
    });

    it('resolves the authority label id from the canonical authority URL', () => {
      const result = getResourceTypeLabelId('http://bibfra.me/vocab/lite/Authority' as ResourceTypeURL);

      expect(result).toBe('ld.authority');
    });

    it('falls back to the instance label id for an unknown URL', () => {
      const result = getResourceTypeLabelId(undefined);

      expect(result).toBe('ld.instance');
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

    it('returns false when profileId is undefined', () => {
      const result = isProfilePreferred({
        profileId: undefined as unknown as string,
        preferredProfiles: mockPreferredProfiles,
        resourceTypeURL: 'work_URL' as ResourceTypeURL,
      });

      expect(result).toBe(false);
    });

    it('returns false when profileId is null', () => {
      const result = isProfilePreferred({
        profileId: null as unknown as string,
        preferredProfiles: mockPreferredProfiles,
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
