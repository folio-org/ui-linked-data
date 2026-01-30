import { alphabeticSortLabel } from '@/common/helpers/common.helper';

describe('common.helper', () => {
  describe('alphabeticSortLabel', () => {
    const a = { label: 'a' };
    const b = { label: 'b' };

    test('returns -1 if a.label precedes b.label', () => {
      expect(alphabeticSortLabel(a, b)).toEqual(-1);
    });

    test('returns 1 if b.label precedes a.label', () => {
      expect(alphabeticSortLabel(b, a)).toEqual(1);
    });

    test('returns 0 if labels are equal', () => {
      expect(alphabeticSortLabel(a, a)).toEqual(0);
    });
  });
});
