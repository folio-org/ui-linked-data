import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';
import { DropdownValueFormatter } from '@/common/services/recordGenerator/processors/profileSchema/formatters/value/dropdownValueFormatter';
import { UserValueContents } from '@/common/services/recordGenerator/processors/value/valueProcessor.interface';

describe('DropdownValueFormatter', () => {
  let formatter: DropdownValueFormatter;

  beforeEach(() => {
    formatter = new DropdownValueFormatter();
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

  describe('formatSimple', () => {
    it('returns object with uri in LINK property and basicLabel in LABEL property when all values exist', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
          basicLabel: 'basic label',
        },
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LINK]: ['test_uri'],
        [BFLITE_URIS.LABEL]: ['basic label'],
      });
    });

    it('uses label when basicLabel is not available', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
        },
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LINK]: ['test_uri'],
        [BFLITE_URIS.LABEL]: ['test label'],
      });
    });

    it('does not include LINK property when uri is not available', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {},
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: ['test label'],
      });
    });

    it('includes LINK but uses empty string in LABEL when both basicLabel and label are not available', () => {
      const value: UserValueContents = {
        label: undefined,
        meta: {
          uri: 'test_uri',
        },
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LINK]: ['test_uri'],
        [BFLITE_URIS.LABEL]: [''],
      });
    });

    it('does not include LINK when meta is undefined', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: undefined,
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: ['test label'],
      });
    });

    it('does not include LINK when meta.uri is null', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: null as unknown as string,
          basicLabel: 'basic label',
        },
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LABEL]: ['basic label'],
      });
    });

    it('prefers basicLabel over label when both are available', () => {
      const value: UserValueContents = {
        label: 'test label',
        meta: {
          uri: 'test_uri',
          basicLabel: 'preferred basic label',
        },
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LINK]: ['test_uri'],
        [BFLITE_URIS.LABEL]: ['preferred basic label'],
      });
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
    });
  });
});
