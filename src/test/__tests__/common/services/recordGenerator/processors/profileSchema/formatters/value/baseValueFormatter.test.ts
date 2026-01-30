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
          [BFLITE_URIS.LABEL]: ['test label'],
          [BFLITE_URIS.LINK]: ['test_uri'],
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
          [BFLITE_URIS.LABEL]: ['test label'],
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
          [BFLITE_URIS.LINK]: ['test_uri'],
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
          [BFLITE_URIS.LABEL]: ['test label'],
        });
      });

      it('returns empty object when value has no label', () => {
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
});
