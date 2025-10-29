import { getLabelId, getWarningByProfileNames } from '@common/helpers/profileSelection.helper';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as BibframeConstants from '@common/constants/bibframe.constants';

const mockBibframeConstants = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
mockBibframeConstants({ WORK: 'work_URL', INSTANCE: 'instance_URL' });

jest.mock('@src/configs', () => ({
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
});
