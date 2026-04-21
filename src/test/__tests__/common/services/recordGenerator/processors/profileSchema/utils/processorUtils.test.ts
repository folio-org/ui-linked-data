import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { ProcessorUtils } from '@/common/services/recordGenerator/processors/profileSchema/utils/processorUtils';
import { UserValueContents } from '@/common/services/recordGenerator/processors/value/valueProcessor.interface';
import {
  ExtendedPropertyResult,
  ProcessorResult,
  SimplePropertyResult,
} from '@/common/services/recordGenerator/types/profileSchemaProcessor.types';

jest.mock('@/common/constants/bibframeMapping.constants', () => ({
  BFLITE_URIS: {
    LINK: 'link',
    LABEL: 'label',
    NAME: 'name',
    CODE: 'code',
  },
}));

describe('ProcessorUtils', () => {
  describe('isStringArray', () => {
    it('returns true for empty array', () => {
      const result = ProcessorUtils.isStringArray([]);

      expect(result).toBe(true);
    });

    it('returns true for array of strings', () => {
      const result = ProcessorUtils.isStringArray(['string_1', 'string_2']);

      expect(result).toBe(true);
    });

    it('returns false for array of objects', () => {
      const result = ProcessorUtils.isStringArray([{ key: 'value' }, { key: 'value_2' }]);

      expect(result).toBe(false);
    });

    it('returns false for array of numbers', () => {
      const result = ProcessorUtils.isStringArray([1, 2, 3]);

      expect(result).toBe(false);
    });
  });

  describe('isSimplePropertyResultArray', () => {
    it('returns true for empty array', () => {
      const result = ProcessorUtils.isSimplePropertyResultArray([]);

      expect(result).toBe(true);
    });

    it('returns true for array of SimplePropertyResult objects', () => {
      const simplePropertyResults = [
        { [BFLITE_URIS.LINK]: ['link_1'], [BFLITE_URIS.LABEL]: ['label_1'] },
        { [BFLITE_URIS.LINK]: ['link_2'], [BFLITE_URIS.LABEL]: ['label_2'] },
      ];

      const result = ProcessorUtils.isSimplePropertyResultArray(simplePropertyResults);

      expect(result).toBe(true);
    });

    it('returns false for array of objects without required properties', () => {
      const invalidObjects = [
        { key1: 'value1', key2: 'value_2' },
        { key3: 'value_3', key4: 'value_4' },
      ];

      const result = ProcessorUtils.isSimplePropertyResultArray(invalidObjects);

      expect(result).toBe(false);
    });

    it('returns false for array of strings', () => {
      const result = ProcessorUtils.isSimplePropertyResultArray(['string_1', 'string_2']);

      expect(result).toBe(false);
    });

    it('returns false for array with null values', () => {
      const result = ProcessorUtils.isSimplePropertyResultArray([null, null]);

      expect(result).toBe(false);
    });
  });

  describe('mergeArrays', () => {
    it('merges two string arrays', () => {
      const existing = ['string_1', 'string_2'];
      const childValues = ['string_3', 'string_4'];

      const result = ProcessorUtils.mergeArrays(existing, childValues);

      expect(result).toEqual(['string_1', 'string_2', 'string_3', 'string_4']);
    });

    it('merges two SimplePropertyResult arrays', () => {
      const existing = [
        { [BFLITE_URIS.LINK]: ['link_1'], [BFLITE_URIS.LABEL]: ['label_1'] },
        { [BFLITE_URIS.LINK]: ['link_2'], [BFLITE_URIS.LABEL]: ['label_2'] },
      ] as SimplePropertyResult[];
      const childValues = [
        { [BFLITE_URIS.LINK]: ['link_3'], [BFLITE_URIS.LABEL]: ['label_3'] },
      ] as SimplePropertyResult[];

      const result = ProcessorUtils.mergeArrays(existing, childValues);

      expect(result).toEqual([
        { [BFLITE_URIS.LINK]: ['link_1'], [BFLITE_URIS.LABEL]: ['label_1'] },
        { [BFLITE_URIS.LINK]: ['link_2'], [BFLITE_URIS.LABEL]: ['label_2'] },
        { [BFLITE_URIS.LINK]: ['link_3'], [BFLITE_URIS.LABEL]: ['label_3'] },
      ]);
    });

    it('returns child values when arrays cannot be merged', () => {
      const existing = ['string_1', 'string_2'];
      const childValues = [{ key: 'value' }] as unknown as ProcessorResult;

      const result = ProcessorUtils.mergeArrays(existing, childValues);

      expect(result).toBe(childValues);
    });

    it('returns child values when existing is not a string or SimplePropertyResult array', () => {
      const existing = [
        {
          [BFLITE_URIS.LINK]: ['link_1'],
          [BFLITE_URIS.LABEL]: ['label_1'],
          [BFLITE_URIS.NAME]: ['name1'],
          [BFLITE_URIS.CODE]: ['code1'],
          complexProperty: ['value'],
        },
      ] as unknown as ExtendedPropertyResult[];
      const childValues = ['string_1', 'string_2'];

      const result = ProcessorUtils.mergeArrays(existing, childValues);

      expect(result).toBe(childValues);
    });
  });

  describe('canMergeArrays', () => {
    it('returns true for two string arrays', () => {
      const existing = ['string_1', 'string_2'];
      const childValues = ['string_3', 'string_4'];

      const result = ProcessorUtils.canMergeArrays(existing, childValues);

      expect(result).toBe(true);
    });

    it('returns true for two SimplePropertyResult arrays', () => {
      const existing = [
        { [BFLITE_URIS.LINK]: ['link_1'], [BFLITE_URIS.LABEL]: ['label_1'] },
        { [BFLITE_URIS.LINK]: ['link_2'], [BFLITE_URIS.LABEL]: ['label_2'] },
      ] as SimplePropertyResult[];
      const childValues = [
        { [BFLITE_URIS.LINK]: ['link_3'], [BFLITE_URIS.LABEL]: ['label_3'] },
      ] as SimplePropertyResult[];

      const result = ProcessorUtils.canMergeArrays(existing, childValues);

      expect(result).toBe(true);
    });

    it('returns false when existing is not an array', () => {
      const existing = { key: 'value' } as unknown as ProcessorResult;
      const childValues = ['string_1', 'string_2'];

      const result = ProcessorUtils.canMergeArrays(existing, childValues);

      expect(result).toBe(false);
    });

    it('returns false when childValues is not an array', () => {
      const existing = ['string_1', 'string_2'];
      const childValues = { key: 'value' } as unknown as ProcessorResult;

      const result = ProcessorUtils.canMergeArrays(existing, childValues);

      expect(result).toBe(false);
    });

    it('returns false when arrays are of different types', () => {
      const existing = ['string_1', 'string_2'];
      const childValues = [
        { [BFLITE_URIS.LINK]: ['link_1'], [BFLITE_URIS.LABEL]: ['label_1'] },
      ] as SimplePropertyResult[];

      const result = ProcessorUtils.canMergeArrays(existing, childValues);

      expect(result).toBe(false);
    });
  });

  describe('extractLabel', () => {
    it('returns label from UserValueContents', () => {
      const value = { label: 'Test Label' } as UserValueContents;

      const result = ProcessorUtils.extractLabel(value);

      expect(result).toBe('Test Label');
    });

    it('returns empty string when label is undefined', () => {
      const value = { label: undefined } as UserValueContents;

      const result = ProcessorUtils.extractLabel(value);

      expect(result).toBe('');
    });
  });

  describe('extractUri', () => {
    it('returns uri from UserValueContents meta', () => {
      const value = { meta: { uri: 'test-uri' } } as UserValueContents;

      const result = ProcessorUtils.extractUri(value);

      expect(result).toBe('test-uri');
    });

    it('returns empty string when meta is undefined', () => {
      const value = { meta: undefined } as UserValueContents;

      const result = ProcessorUtils.extractUri(value);

      expect(result).toBe('');
    });

    it('returns empty string when meta.uri is undefined', () => {
      const value = { meta: { uri: undefined } } as UserValueContents;

      const result = ProcessorUtils.extractUri(value);

      expect(result).toBe('');
    });
  });
});
