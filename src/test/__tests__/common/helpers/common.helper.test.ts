import { alphabeticSortLabel, ensureArray } from '@/common/helpers/common.helper';

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

  describe('ensureArray', () => {
    test('returns empty array for undefined', () => {
      expect(ensureArray(undefined)).toEqual([]);
    });

    test('returns empty array for null', () => {
      expect(ensureArray(null)).toEqual([]);
    });

    test('returns array as-is when value is already an array', () => {
      const input = ['value_1', 'value_2'];
      const result = ensureArray(input);

      expect(result).toEqual(['value_1', 'value_2']);
      expect(result).toBe(input);
    });

    test('wraps single string value in an array', () => {
      expect(ensureArray('test')).toEqual(['test']);
    });

    test('wraps single number value in an array', () => {
      expect(ensureArray(42)).toEqual([42]);
    });

    test('wraps single object value in an array', () => {
      const obj = { id: 'id_1', label: 'label_1' };

      expect(ensureArray(obj)).toEqual([obj]);
    });

    test('returns empty array as-is', () => {
      const input: string[] = [];
      const result = ensureArray(input);

      expect(result).toEqual([]);
      expect(result).toBe(input);
    });
  });
});
