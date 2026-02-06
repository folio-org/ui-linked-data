import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { GroupValueFormatter } from '@/common/services/recordGenerator/processors/profileSchema/formatters/value/groupValueFormatter';
import { UserValueContents } from '@/common/services/recordGenerator/processors/value/valueProcessor.interface';

describe('GroupValueFormatter', () => {
  let formatter: GroupValueFormatter;

  beforeEach(() => {
    formatter = new GroupValueFormatter();
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
  });

  describe('formatSimple', () => {
    it('returns empty array when meta.uri is undefined', () => {
      const value: UserValueContents = { label: 'test label' };

      const result = formatter.formatSimple(value);

      expect(result).toEqual([]);
    });

    it('returns empty array when meta is undefined', () => {
      const value: UserValueContents = { label: 'test label', meta: undefined };

      const result = formatter.formatSimple(value);

      expect(result).toEqual([]);
    });

    it('returns array with uri when meta.uri exists and no mappedValues are provided', () => {
      const value: UserValueContents = { label: 'test label', meta: { uri: 'test_uri' } };

      const result = formatter.formatSimple(value);

      expect(result).toEqual(['test_uri']);
    });

    it('returns mapped value when uri matches a mappedValue', () => {
      const value: UserValueContents = { label: 'test label', meta: { uri: 'test_uri' } };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          mappedValues: {
            mapped_key: { uri: 'test_uri' },
            other_key: { uri: 'other_uri' },
          },
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual(['mapped_key']);
    });

    it('returns uri when no matching mappedValues are found', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          mappedValues: {
            mapped_key: { uri: 'different_uri' },
            other_key: { uri: 'other_uri' },
          },
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual(['test_uri']);
    });

    it('returns uri when recordSchemaEntry has no options', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual(['test_uri']);
    });

    it('returns uri when recordSchemaEntry.options has no mappedValues', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {},
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual(['test_uri']);
    });

    it('returns uri when recordSchemaEntry.options includeTerm is false', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          includeTerm: false,
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual(['test_uri']);
    });

    it('returns object with link and term when recordSchemaEntry.options has includeTerm', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          includeTerm: true,
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['test label'],
        [BFLITE_URIS.LINK]: ['test_uri'],
      });
    });

    it('does not include LINK when includeTerm is true but uri is undefined', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {},
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          includeTerm: true,
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['test label'],
      });
    });

    it('does not include LINK when includeTerm is true but uri is null', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: null as unknown as string,
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          includeTerm: true,
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['test label'],
      });
    });

    it('does not include LINK when includeTerm is true but uri is empty string', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: '',
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          includeTerm: true,
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['test label'],
      });
    });

    it('uses basicLabel when available with includeTerm', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
          basicLabel: 'basic label',
        },
      };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {
          includeTerm: true,
        },
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual({
        [BFLITE_URIS.TERM]: ['basic label'],
        [BFLITE_URIS.LINK]: ['test_uri'],
      });
    });
  });
  describe('formatComplex', () => {
    it('returns srsId when available', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: { srsId: 'test_srs_id' },
        id: 'test_id',
      };

      const result = formatter.formatComplex(value);

      expect(result).toEqual('test_srs_id');
    });

    it('returns id when srsId is not available', () => {
      const value: UserValueContents = {
        label: 'test label',
        id: 'test_id',
      };

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
  });
});
