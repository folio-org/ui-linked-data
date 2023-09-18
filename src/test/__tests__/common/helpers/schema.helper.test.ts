import * as SchemaHelper from '@common/helpers/schema.helper';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import * as FeatureConstants from '@common/constants/feature.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

describe('schema.helper', () => {
  const { getLookupLabelKey, generateUserValueObject, getSelectedRecord, generateRecordForDropdown } = SchemaHelper;
  const mockFeatureConstant = getMockedImportedConstant(FeatureConstants, 'IS_NEW_API_ENABLED');
  const mockBFUrisConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  const mockBFLabelsConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_LABELS_MAP');

  describe('getLookupLabelKey', () => {
    test('returns mapped value', () => {
      const uriBFLite = 'testUriBFLite';
      const mappedValue = 'testMappedValue';
      mockBFLabelsConstant({ testUriBFLite: mappedValue });

      const result = getLookupLabelKey(uriBFLite);

      expect(result).toBe(mappedValue);
    });

    test('returns default Label value', () => {
      const uriBFLite = 'testUriBFLite';
      const labelUri = 'testLabelUri';
      mockBFLabelsConstant({});
      mockBFUrisConstant({ LABEL: labelUri });

      const result = getLookupLabelKey(uriBFLite);

      expect(result).toBe(labelUri);
    });

    test('returns Term value', () => {
      const termUri = 'testTermUri';
      mockBFUrisConstant({ TERM: termUri });

      const result = getLookupLabelKey();

      expect(result).toBe(termUri);
    });
  });

  describe('generateUserValueObject', () => {
    test('returns an object which was generated from the simple entry', () => {
      mockFeatureConstant(false);
      jest.spyOn(SchemaHelper, 'getLookupLabelKey').mockReturnValueOnce('testKey');
      const entry = { uri: 'testUri', label: 'testLabel' };
      const type = 'testType' as AdvancedFieldType;
      const testResult = {
        label: 'testLabel',
        meta: {
          parentURI: 'testUri',
          uri: 'testUri',
          type: 'testType',
        },
      };

      const result = generateUserValueObject(entry, type);

      expect(result).toEqual(testResult);
    });

    test('returns an object which was generated from the nested entry', () => {
      mockFeatureConstant(true);
      mockBFUrisConstant({ LINK: 'testLink' });
      jest.spyOn(SchemaHelper, 'getLookupLabelKey').mockReturnValueOnce('testKey');
      const entry = { uri: 'testUri', label: 'testLabel', testKey: 'testLabelKey' };
      const type = 'testType' as AdvancedFieldType;
      const testResult = {
        label: 'testLabelKey',
        meta: {
          parentURI: 'testLink',
          uri: 'testLink',
          type: 'testType',
        },
      };

      const result = generateUserValueObject(entry, type);

      expect(result).toEqual(testResult);
    });
  });

  describe('getSelectedRecord', () => {
    const uriWithSelector = 'testUriWithSelector_1';

    function testGetSelectedRecord(record: Record<string, any> | Array<any>, uri: string) {
      const testResult = {
        record_1: 'testValue_1',
      };

      const result = getSelectedRecord(uri, record);

      expect(result).toEqual(testResult);
    }

    test('returns a selected record from the passed array', () => {
      testGetSelectedRecord(
        [
          { testUriWithSelector_1: { record_1: 'testValue_1' } },
          { testUriWithSelector_2: { record_2: 'testValue_2' } },
        ],
        uriWithSelector,
      );
    });

    test('returns a selected record from the passed object', () => {
      testGetSelectedRecord(
        {
          testUriWithSelector_1: { record_1: 'testValue_1' },
          testUriWithSelector_2: { record_2: 'testValue_2' },
        },
        uriWithSelector,
      );
    });

    test('returns falsy value', () => {
      const result = getSelectedRecord(uriWithSelector);

      expect(result).toBeFalsy();
    });
  });

  describe('generateRecordForDropdown', () => {
    test('returns the original record', () => {
      const record = { testKey: 'value' };
      const uriWithSelector = 'testUri';
      const hasRootWrapper = false;

      const result = generateRecordForDropdown({
        record,
        uriWithSelector,
        hasRootWrapper,
      });

      expect(result).toEqual(record);
    });

    test('returns a selected record', () => {
      const uriWithSelector = 'testUri';
      const hasRootWrapper = true;
      const testResult = { result: 'value' };
      jest.spyOn(SchemaHelper, 'getSelectedRecord').mockReturnValueOnce(testResult);

      const result = generateRecordForDropdown({
        uriWithSelector,
        hasRootWrapper,
      });

      expect(result).toEqual(testResult);
    });
  });
});
