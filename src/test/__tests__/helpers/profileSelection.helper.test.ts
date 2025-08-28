import { getLabelId, getWarningByProfileNames } from '@common/helpers/profileSelection.helper';
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
});
