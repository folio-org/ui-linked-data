import { ResourceType } from '@/common/constants/record.constants';
import {
  getResourceTypeConfig,
  hasPreview,
  hasReference,
  getReference,
  getDefaultProfileId,
  getProfileBfid,
  getEditSectionPassiveClass,
  getEditPageLayout,
  getPreviewPosition,
  hasSplitLayout,
} from './resourceType.accessors';

describe('resourceType.accessors', () => {
  describe('getResourceTypeConfig', () => {
    it('Returns config for work type', () => {
      const result = getResourceTypeConfig(ResourceType.work);

      expect(result.type).toBe(ResourceType.work);
      expect(result.profileBfid).toBe('lde:Profile:Work');
    });

    it('Returns config for instance type', () => {
      const result = getResourceTypeConfig(ResourceType.instance);

      expect(result.type).toBe(ResourceType.instance);
      expect(result.profileBfid).toBe('lde:Profile:Instance');
    });

    it('Falls back to instance for null', () => {
      const result = getResourceTypeConfig(null);

      expect(result.type).toBe(ResourceType.instance);
    });

    it('Falls back to instance for undefined', () => {
      const result = getResourceTypeConfig(undefined);

      expect(result.type).toBe(ResourceType.instance);
    });

    it('Falls back to instance for unknown string', () => {
      const result = getResourceTypeConfig('unknown_type');

      expect(result.type).toBe(ResourceType.instance);
    });
  });

  describe('hasPreview', () => {
    it('Returns true for work type', () => {
      expect(hasPreview(ResourceType.work)).toBe(true);
    });

    it('Returns true for instance type', () => {
      expect(hasPreview(ResourceType.instance)).toBe(true);
    });
  });

  describe('hasReference', () => {
    it('Returns true for work type', () => {
      expect(hasReference(ResourceType.work)).toBe(true);
    });

    it('Returns true for instance type', () => {
      expect(hasReference(ResourceType.instance)).toBe(true);
    });
  });

  describe('getReference', () => {
    it('Returns reference for work type', () => {
      const result = getReference(ResourceType.work);

      expect(result).toEqual({
        key: '_instanceReference',
        uri: 'http://bibfra.me/vocab/lite/Instance',
        targetType: ResourceType.instance,
      });
    });

    it('Returns reference for instance type', () => {
      const result = getReference(ResourceType.instance);

      expect(result).toEqual({
        key: '_workReference',
        uri: 'http://bibfra.me/vocab/lite/Work',
        targetType: ResourceType.work,
      });
    });
  });

  describe('getDefaultProfileId', () => {
    it('Returns 2 for work type', () => {
      expect(getDefaultProfileId(ResourceType.work)).toBe(2);
    });

    it('Returns 3 for instance type', () => {
      expect(getDefaultProfileId(ResourceType.instance)).toBe(3);
    });
  });

  describe('getEditSectionPassiveClass', () => {
    it('Returns class name for work type', () => {
      expect(getEditSectionPassiveClass(ResourceType.work)).toBe('edit-section-passive');
    });

    it('Returns undefined for instance type', () => {
      expect(getEditSectionPassiveClass(ResourceType.instance)).toBeUndefined();
    });
  });

  describe('getEditPageLayout', () => {
    it('Returns split layout for work type', () => {
      expect(getEditPageLayout(ResourceType.work)).toBe('split');
    });

    it('Returns split layout for instance type', () => {
      expect(getEditPageLayout(ResourceType.instance)).toBe('split');
    });

    it('Returns single as default when not specified', () => {
      const result = getEditPageLayout(null);

      expect(result).toBe('split');
    });
  });

  describe('getPreviewPosition', () => {
    it('Returns right for work type', () => {
      expect(getPreviewPosition(ResourceType.work)).toBe('right');
    });

    it('Returns left for instance type', () => {
      expect(getPreviewPosition(ResourceType.instance)).toBe('left');
    });
  });

  describe('hasSplitLayout', () => {
    it('Returns true for work type with split layout', () => {
      expect(hasSplitLayout(ResourceType.work)).toBe(true);
    });

    it('Returns true for instance type with split layout', () => {
      expect(hasSplitLayout(ResourceType.instance)).toBe(true);
    });
  });

  describe('getProfileBfid', () => {
    it('Returns correct BFID for work type', () => {
      expect(getProfileBfid(ResourceType.work)).toBe('lde:Profile:Work');
    });

    it('Returns correct BFID for instance type', () => {
      expect(getProfileBfid(ResourceType.instance)).toBe('lde:Profile:Instance');
    });
  });
});
