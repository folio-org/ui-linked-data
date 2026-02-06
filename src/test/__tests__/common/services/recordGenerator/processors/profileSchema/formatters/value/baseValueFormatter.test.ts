import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { BaseValueFormatter } from '@/common/services/recordGenerator/processors/profileSchema/formatters/value/baseValueFormatter';
import { UserValueContents } from '@/common/services/recordGenerator/processors/value/valueProcessor.interface';

class TestValueFormatter extends BaseValueFormatter {
  formatSimple(value: UserValueContents) {
    return [value.meta?.uri ?? ''];
  }
}

describe('BaseValueFormatter', () => {
  let formatter: TestValueFormatter;

  beforeEach(() => {
    formatter = new TestValueFormatter();
  });

  describe('formatLiteral', () => {
    it('returns label in array when label exists', () => {
      const value: UserValueContents = { label: 'test label' };

      const result = formatter.formatLiteral(value);

      expect(result).toEqual(['test label']);
    });

    it('returns empty array when label is undefined', () => {
      const value: UserValueContents = { label: undefined };

      const result = formatter.formatLiteral(value);

      expect(result).toEqual([]);
    });

    it('returns empty array when label is null', () => {
      const value: UserValueContents = { label: null as unknown as string };

      const result = formatter.formatLiteral(value);

      expect(result).toEqual([]);
    });

    it('returns empty array when label is empty string', () => {
      const value: UserValueContents = { label: '' };

      const result = formatter.formatLiteral(value);

      expect(result).toEqual([]);
    });
  });

  describe('formatComplex', () => {
    describe('when recordSchemaEntry has properties (Hub scenario)', () => {
      it('returns complex object with LABEL and LINK when value has label and uri', () => {
        const value: UserValueContents = {
          label: 'test label',
          meta: { uri: 'test_uri' },
        };
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.object,
          properties: {
            [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
            [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
          },
        };

        const result = formatter.formatComplex(value, recordSchemaEntry);

        expect(result).toEqual({
          [BFLITE_URIS.LABEL]: 'test label',
          [BFLITE_URIS.LINK]: 'test_uri',
        });
      });

      it('returns complex object when only LABEL property is defined in schema', () => {
        const value: UserValueContents = {
          label: 'test label',
          meta: { uri: 'test_uri' },
        };
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.object,
          properties: {
            [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
          },
        };

        const result = formatter.formatComplex(value, recordSchemaEntry);

        expect(result).toEqual({
          [BFLITE_URIS.LABEL]: 'test label',
        });
      });

      it('returns complex object when only LINK property is defined in schema', () => {
        const value: UserValueContents = {
          label: 'test label',
          meta: { uri: 'test_uri' },
        };
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.object,
          properties: {
            [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
          },
        };

        const result = formatter.formatComplex(value, recordSchemaEntry);

        expect(result).toEqual({
          [BFLITE_URIS.LINK]: 'test_uri',
        });
      });

      it('returns complex object with only LABEL when value has label but no uri', () => {
        const value: UserValueContents = {
          label: 'test label',
        };
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.object,
          properties: {
            [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
            [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
          },
        };

        const result = formatter.formatComplex(value, recordSchemaEntry);

        expect(result).toEqual({
          [BFLITE_URIS.LABEL]: 'test label',
        });
      });

      it('returns empty string when value has no label', () => {
        const value: UserValueContents = {
          meta: { uri: 'test_uri' },
        };
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.object,
          properties: {
            [BFLITE_URIS.LABEL]: { type: RecordSchemaEntryType.string },
            [BFLITE_URIS.LINK]: { type: RecordSchemaEntryType.string },
          },
        };

        const result = formatter.formatComplex(value, recordSchemaEntry);

        expect(result).toEqual('');
      });
    });

    describe('when recordSchemaEntry has no properties (Creator/Contributor scenario)', () => {
      it('returns srsId when available', () => {
        const value = {
          label: 'test label',
          meta: { srsId: 'test_srs_id' },
          id: 'test_id',
        } as unknown as UserValueContents;

        const result = formatter.formatComplex(value);

        expect(result).toEqual('test_srs_id');
      });

      it('returns id when srsId is not available', () => {
        const value = {
          label: 'test label',
          id: 'test_id',
        } as unknown as UserValueContents;

        const result = formatter.formatComplex(value);

        expect(result).toEqual('test_id');
      });

      it('returns empty string when neither srsId nor id is available', () => {
        const value: UserValueContents = {
          label: 'test label',
        };

        const result = formatter.formatComplex(value);

        expect(result).toEqual('');
      });

      it('returns empty string when meta is undefined', () => {
        const value: UserValueContents = {
          label: 'test label',
          meta: undefined,
        };

        const result = formatter.formatComplex(value);

        expect(result).toEqual('');
      });

      it('returns empty string when both srsId and id are empty strings', () => {
        const value = {
          label: 'test label',
          meta: { srsId: '' },
          id: '',
        } as unknown as UserValueContents;

        const result = formatter.formatComplex(value);

        expect(result).toEqual('');
      });
    });

    describe('when recordSchemaEntry is undefined', () => {
      it('returns srsId when available', () => {
        const value = {
          label: 'test label',
          meta: { srsId: 'test_srs_id' },
          id: 'test_id',
        } as unknown as UserValueContents;

        const result = formatter.formatComplex(value);

        expect(result).toEqual('test_srs_id');
      });

      it('returns id when srsId is not available', () => {
        const value = {
          label: 'test label',
          id: 'test_id',
        } as unknown as UserValueContents;

        const result = formatter.formatComplex(value);

        expect(result).toEqual('test_id');
      });
    });

    describe('when recordSchemaEntry properties is undefined', () => {
      it('returns srsId when available', () => {
        const value = {
          label: 'test label',
          meta: { srsId: 'test_srs_id' },
          id: 'test_id',
        } as unknown as UserValueContents;
        const recordSchemaEntry = {
          type: RecordSchemaEntryType.object,
          properties: undefined,
        };

        const result = formatter.formatComplex(value, recordSchemaEntry);

        expect(result).toEqual('test_srs_id');
      });
    });
  });

  describe('buildLinkLabelObject', () => {
    it('returns object with label key and value', () => {
      const result = formatter['buildLinkLabelObject'](BFLITE_URIS.LABEL, 'test_label');

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: ['test_label'],
      });
    });

    it('includes LINK when uri is provided', () => {
      const result = formatter['buildLinkLabelObject'](BFLITE_URIS.LABEL, 'test_label', 'test_uri');

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: ['test_label'],
        [BFLITE_URIS.LINK]: ['test_uri'],
      });
    });

    it('does not include LINK when uri is undefined', () => {
      const result = formatter['buildLinkLabelObject'](BFLITE_URIS.TERM, 'test_term');

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['test_term'],
      });
    });

    it('does not include LINK when uri is null', () => {
      const result = formatter['buildLinkLabelObject'](BFLITE_URIS.LABEL, 'test_label', null);

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: ['test_label'],
      });
    });

    it('does not include LINK when uri is empty string', () => {
      const result = formatter['buildLinkLabelObject'](BFLITE_URIS.TERM, 'test_term', '');

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['test_term'],
      });
    });

    it('works with TERM as label key', () => {
      const result = formatter['buildLinkLabelObject'](BFLITE_URIS.TERM, 'test_term', 'test_uri');

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['test_term'],
        [BFLITE_URIS.LINK]: ['test_uri'],
      });
    });
  });

  describe('buildComplexObject', () => {
    it('builds object using valueSource option when specified', () => {
      const value: UserValueContents = {
        label: 'Test Hub',
        id: 'test-id',
        meta: { uri: 'http://test.uri', basicLabel: 'Basic Label' },
      };
      const properties = {
        'custom-id': {
          type: RecordSchemaEntryType.string,
          options: { valueSource: 'id' as const },
        },
        'custom-uri': {
          type: RecordSchemaEntryType.string,
          options: { valueSource: 'meta.uri' as const },
        },
        'custom-label': {
          type: RecordSchemaEntryType.string,
          options: { valueSource: 'meta.basicLabel' as const },
        },
      };

      const result = formatter['buildComplexObject'](value, properties);

      expect(result).toEqual({
        'custom-id': 'test-id',
        'custom-uri': 'http://test.uri',
        'custom-label': 'Basic Label',
      });
    });

    it('uses backward-compatible mapping when valueSource is not specified', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        meta: { uri: 'http://test.uri' },
      };
      const properties = {
        [BFLITE_URIS.LABEL]: {
          type: RecordSchemaEntryType.string,
        },
        [BFLITE_URIS.LINK]: {
          type: RecordSchemaEntryType.string,
        },
      };

      const result = formatter['buildComplexObject'](value, properties);

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: 'Test Label',
        [BFLITE_URIS.LINK]: 'http://test.uri',
      });
    });

    it('excludes properties with null or undefined values', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        meta: {},
      };
      const properties = {
        [BFLITE_URIS.LABEL]: {
          type: RecordSchemaEntryType.string,
        },
        [BFLITE_URIS.LINK]: {
          type: RecordSchemaEntryType.string,
        },
      };

      const result = formatter['buildComplexObject'](value, properties);

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: 'Test Label',
      });
    });

    it('excludes properties with empty string values', () => {
      const value: UserValueContents = {
        label: '',
        meta: { uri: 'http://test.uri' },
      };
      const properties = {
        [BFLITE_URIS.LABEL]: {
          type: RecordSchemaEntryType.string,
        },
        [BFLITE_URIS.LINK]: {
          type: RecordSchemaEntryType.string,
        },
      };

      const result = formatter['buildComplexObject'](value, properties);

      expect(result).toEqual({});
    });
  });

  describe('resolveValuePath', () => {
    it('resolves simple path', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        id: 'test-id',
      };

      const result = formatter['resolveValuePath'](value, 'id');

      expect(result).toBe('test-id');
    });

    it('resolves nested path with dot notation', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        meta: { uri: 'http://test.uri', basicLabel: 'Basic Label' },
      };

      const result = formatter['resolveValuePath'](value, 'meta.uri');

      expect(result).toBe('http://test.uri');
    });

    it('resolves deeply nested path', () => {
      const value = {
        label: 'Test Label',
        meta: {
          nested: {
            deep: {
              value: 'deep-value',
            },
          },
        },
      } as unknown as UserValueContents;

      const result = formatter['resolveValuePath'](value, 'meta.nested.deep.value');

      expect(result).toBe('deep-value');
    });

    it('returns null when path does not exist', () => {
      const value: UserValueContents = {
        label: 'Test Label',
      };

      const result = formatter['resolveValuePath'](value, 'meta.nonexistent');

      expect(result).toBeNull();
    });

    it('returns null when intermediate path is null', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        meta: null as unknown as UserValueContents['meta'],
      };

      const result = formatter['resolveValuePath'](value, 'meta.uri');

      expect(result).toBeNull();
    });

    it('returns null when intermediate path is undefined', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        meta: undefined,
      };

      const result = formatter['resolveValuePath'](value, 'meta.uri');

      expect(result).toBeNull();
    });

    it('returns null when resolved value is not a string', () => {
      const value = {
        label: 'Test Label',
        meta: {
          complexValue: { nested: 'value' },
        },
      } as unknown as UserValueContents;

      const result = formatter['resolveValuePath'](value, 'meta.complexValue');

      expect(result).toBeNull();
    });
  });

  describe('getValueFromSource', () => {
    it('uses valueSource when specified', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        id: 'test-id',
        meta: { uri: 'http://test.uri' },
      };

      const result = formatter['getValueFromSource'](value, 'id', BFLITE_URIS.LABEL);

      expect(result).toBe('test-id');
    });

    it('uses backward-compatible mapping when valueSource is undefined', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        meta: { uri: 'http://test.uri' },
      };

      const resultLabel = formatter['getValueFromSource'](value, undefined, BFLITE_URIS.LABEL);
      const resultLink = formatter['getValueFromSource'](value, undefined, BFLITE_URIS.LINK);

      expect(resultLabel).toBe('Test Label');
      expect(resultLink).toBe('http://test.uri');
    });

    it('resolves nested paths with valueSource', () => {
      const value: UserValueContents = {
        label: 'Test Label',
        meta: { uri: 'http://test.uri', basicLabel: 'Basic Label' },
      };

      const result = formatter['getValueFromSource'](value, 'meta.basicLabel', 'custom-key');

      expect(result).toBe('Basic Label');
    });
  });
});
