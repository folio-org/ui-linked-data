import { AdvancedFieldType } from '@/common/constants/uiControls.constants';
import { detectDrift } from '@/common/helpers/profileSettingsDrift.helper';

describe('profileSettingsDrift.helper', () => {
  describe('detectDrift', () => {
    const testProfile = [
      {
        id: 'document',
        type: AdvancedFieldType.block,
        uriBFLite: 'type-uri',
        children: ['field-a', 'field-b', 'field-c', 'field-d'],
      },
      {
        id: 'field-a',
        type: AdvancedFieldType.literal,
      },
      {
        id: 'field-b',
        type: AdvancedFieldType.literal,
      },
      {
        id: 'field-c',
        type: AdvancedFieldType.literal,
      },
      {
        id: 'field-d',
        type: AdvancedFieldType.literal,
      },
    ] as Profile;

    it('no drift when settings and profile children sets match', () => {
      const settings = {
        active: true,
        children: [{ id: 'field-a' }, { id: 'field-b' }, { id: 'field-c' }, { id: 'field-d' }],
      } as ProfileSettings;

      const result = detectDrift(testProfile, settings, 'type-uri');

      expect(result.missingFromSettings).toHaveLength(0);
    });

    it('no drift when profile children are a subset of settings children', () => {
      const settings = {
        active: true,
        children: [
          { id: 'field-a' },
          { id: 'field-b' },
          { id: 'field-c' },
          { id: 'field-d' },
          { id: 'field-e' },
          { id: 'field-f' },
        ],
      } as ProfileSettings;

      const result = detectDrift(testProfile, settings, 'type-uri');

      expect(result.missingFromSettings).toHaveLength(0);
    });

    it('drift detected when settings children are a subset of profile children', () => {
      const settings = {
        active: true,
        children: [{ id: 'field-a' }, { id: 'field-b' }],
      } as ProfileSettings;

      const result = detectDrift(testProfile, settings, 'type-uri');

      expect(result.resourceTypeURL).toEqual('type-uri');
      expect(result.missingFromSettings).toHaveLength(2);
      expect(result.missingFromSettings).toContain('field-c');
      expect(result.missingFromSettings).toContain('field-d');
    });

    it('no drift detected for non-matching resource type URL where drift would normally be detected', () => {
      const settings = {
        active: true,
        children: [{ id: 'field-a' }, { id: 'field-b' }],
      } as ProfileSettings;

      const result = detectDrift(testProfile, settings, 'different-type-uri');

      expect(result.resourceTypeURL).toEqual('different-type-uri');
      expect(result.missingFromSettings).toHaveLength(0);
    });

    it('no drift detected for no resource type URL where drift would normally be detected', () => {
      const settings = {
        active: true,
        children: [{ id: 'field-a' }, { id: 'field-b' }],
      } as ProfileSettings;

      const result = detectDrift(testProfile, settings);

      expect(result.resourceTypeURL).toBeUndefined();
      expect(result.missingFromSettings).toHaveLength(0);
    });
  });
});
