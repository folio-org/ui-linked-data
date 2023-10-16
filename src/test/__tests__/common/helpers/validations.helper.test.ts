import { normalizeLccn, validateLccn } from '@common/helpers/validations.helper';

describe('validations.helper', () => {
  describe('normalizeLccn', () => {
    test("returns false if the lccn can't be normalized", () => {
      expect(normalizeLccn('1234--5')).toBeFalsy();
      expect(normalizeLccn('1234-')).toBeFalsy();
      expect(normalizeLccn('134')).toBeFalsy();
      expect(normalizeLccn('123-45')).toBeFalsy();
      expect(normalizeLccn('20161234567')).toBeFalsy();
    });

    test("doesn't backfill when the length is sufficient", () => {
      expect(normalizeLccn('1234-567890')).toEqual('1234567890');
      expect(normalizeLccn(' 1234 567  89 0 ')).toEqual('1234567890');
      expect(normalizeLccn(' 1234  - 567  89 0 ')).toEqual('1234567890');
    });

    test('backfills with zeroes', () => {
      expect(normalizeLccn('1234-567')).toEqual('1234000567');
      expect(normalizeLccn('1234-1')).toEqual('1234000001');
    });
  });

  describe('validateLccn', () => {
    test('returns true for valid normalized lccn', () => {
      expect(validateLccn('1234567890')).toBeTruthy();
    });

    test('returns true for valid non-normalized lccn', () => {
      expect(validateLccn(' 2017000002', false)).toBeTruthy();
      expect(validateLccn('1234-1///aarrRRr', false)).toBeTruthy();
    });

    test('returns false for invalid non-normalized lccn', () => {
      expect(validateLccn('20161234567', false)).toBeFalsy();
      expect(validateLccn('20121234', false)).toBeFalsy();
      expect(validateLccn('20/121234', false)).toBeFalsy();
      expect(validateLccn(' 20a17000002', false)).toBeFalsy();
      expect(validateLccn('12R34-1r///aarrRRr', false)).toBeFalsy();
      expect(validateLccn('aa12345-6-6', false)).toBeFalsy();
      expect(validateLccn('1234567-123', false)).toBeFalsy();
      expect(validateLccn('12       345-6   7 123', false)).toBeFalsy();
    });
  });
});
