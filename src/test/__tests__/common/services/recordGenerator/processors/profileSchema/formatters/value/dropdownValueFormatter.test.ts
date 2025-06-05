import { DropdownValueFormatter } from '@common/services/recordGenerator/processors/profileSchema/formatters/value/dropdownValueFormatter';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

jest.mock('@common/constants/bibframeMapping.constants', () => ({
  BFLITE_URIS: {
    LINK: 'link_uri',
    LABEL: 'label_uri',
  },
}));

describe('DropdownValueFormatter', () => {
  let formatter: DropdownValueFormatter;

  beforeEach(() => {
    formatter = new DropdownValueFormatter();
  });

  describe('formatLiteral', () => {
    it('returns label in array when label exists', () => {
      const value = { label: 'test label' };

      const result = formatter.formatLiteral(value);

      expect(result).toEqual(['test label']);
    });

    it('returns empty array when label is undefined', () => {
      const value = { label: undefined };

      const result = formatter.formatLiteral(value);

      expect(result).toEqual([]);
    });

    it('returns empty array when label is null', () => {
      const value = { label: null as unknown as string };

      const result = formatter.formatLiteral(value);

      expect(result).toEqual([]);
    });
  });

  describe('formatSimple', () => {
    it('returns object with uri in LINK property and label in LABEL property when all values exist', () => {
      const value = {
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
      const value = {
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

    it('returns empty string in LINK property when uri is not available', () => {
      const value = {
        label: 'test label',
        meta: {},
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LINK]: [''],
        [BFLITE_URIS.LABEL]: ['test label'],
      });
    });

    it('returns empty string in LABEL property when both basicLabel and label are not available', () => {
      const value = {
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

    it('returns empty strings when meta is undefined', () => {
      const value = {
        label: 'test label',
        meta: undefined,
      };

      const result = formatter.formatSimple(value);

      expect(result).toEqual({
        [BFLITE_URIS.LINK]: [''],
        [BFLITE_URIS.LABEL]: ['test label'],
      });
    });
  });

  describe('formatComplex', () => {
    it('returns object with srsId when srsId is available', () => {
      const value = {
        label: 'test label',
        id: 'test_id',
        meta: {
          srsId: 'test_srs_id',
        },
      };

      const result = formatter.formatComplex(value);

      expect(result).toEqual({ srsId: 'test_srs_id' });
    });

    it('returns object with id when srsId is not available', () => {
      const value = {
        label: 'test label',
        id: 'test_id',
      };

      const result = formatter.formatComplex(value);

      expect(result).toEqual({ id: 'test_id' });
    });

    it('handles array of srsId values', () => {
      const value = {
        label: 'test label',
        id: 'test_id',
        meta: {
          srsId: 'srsId_1',
        },
      };

      const result = formatter.formatComplex(value);

      expect(result).toEqual({ srsId: 'srsId_1' });
    });

    it('handles undefined meta', () => {
      const value = {
        label: 'test label',
        id: 'test_id',
        meta: undefined,
      };

      const result = formatter.formatComplex(value);

      expect(result).toEqual({ id: 'test_id' });
    });

    it('handles undefined id', () => {
      const value = {
        label: 'test label',
      };

      const result = formatter.formatComplex(value);

      expect(result).toEqual({ id: undefined });
    });
  });
});
