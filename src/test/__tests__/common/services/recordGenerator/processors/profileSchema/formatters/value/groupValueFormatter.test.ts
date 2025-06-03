import { GroupValueFormatter } from '@common/services/recordGenerator/processors/profileSchema/formatters/value/groupValueFormatter';
import { UserValueContents } from '@common/services/recordGenerator/processors/value/valueProcessor.interface';

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
      const value: UserValueContents = { label: 'test label', meta: { uri: 'test_uri' } };
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
      const value: UserValueContents = { label: 'test label', meta: { uri: 'test_uri' } };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual(['test_uri']);
    });

    it('returns uri when recordSchemaEntry.options has no mappedValues', () => {
      const value: UserValueContents = { label: 'test label', meta: { uri: 'test_uri' } };
      const recordSchemaEntry = {
        type: 'string' as RecordSchemaEntryType,
        options: {},
      };

      const result = formatter.formatSimple(value, recordSchemaEntry);

      expect(result).toEqual(['test_uri']);
    });
  });
  describe('formatComplex', () => {
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

    it('returns first element when srsId is an array', () => {
      const value = {
        label: 'test label',
        meta: { srsId: ['id_1', 'id_2'] },
      } as unknown as UserValueContents;

      const result = formatter.formatComplex(value);

      expect(result).toEqual('id_1');
    });

    it('returns first element when id is an array', () => {
      const value = {
        label: 'test label',
        id: ['id_1', 'id_2'],
      } as unknown as UserValueContents;

      const result = formatter.formatComplex(value);

      expect(result).toEqual('id_1');
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
