import { AdvancedFieldType } from '@/common/constants/uiControls.constants';

import { chooseModifiers } from './modifiers';

describe('modifiers', () => {
  const mockProfile = [
    {
      id: 'document',
      displayName: 'Document',
      type: AdvancedFieldType.block,
      children: ['a', 'b'],
    },
    {
      id: 'a',
      displayName: 'A',
      type: AdvancedFieldType.literal,
      constraints: {
        mandatory: false,
      },
    },
    {
      id: 'b',
      displayName: 'B',
      type: AdvancedFieldType.literal,
      constraints: {
        mandatory: true,
      },
    },
  ] as Profile;

  describe('chooseModifiers', () => {
    it('returns no modifiers if no profile', () => {
      const modifiers = chooseModifiers('a', null);

      expect(modifiers.length).toBe(0);
    });

    it('returns no modifiers if no activeId', () => {
      const modifiers = chooseModifiers(null, mockProfile);

      expect(modifiers.length).toBe(0);
    });

    it('returns no modifiers if active component is not mandatory', () => {
      const modifiers = chooseModifiers('a', mockProfile);

      expect(modifiers.length).toBe(0);
    });

    it('returns modifier if active component is mandatory', () => {
      const modifiers = chooseModifiers('b', mockProfile);

      expect(modifiers.length).toBe(1);
    });
  });
});
