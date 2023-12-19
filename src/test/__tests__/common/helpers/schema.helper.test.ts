import * as uuid from 'uuid';
import * as SchemaHelper from '@common/helpers/schema.helper';
import * as BibframeHelper from '@common/helpers/bibframe.helper';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

jest.mock('uuid');

describe('schema.helper', () => {
  const {
    getLookupLabelKey,
    getAdvancedValuesField,
    generateAdvancedFieldObject,
    generateUserValueObject,
    getSelectedRecord,
    generateRecordForDropdown,
    generateUserValueContent,
    getFilteredRecordData,
    generateCopiedGroupUuids,
    hasChildEntry,
  } = SchemaHelper;
  const mockBFUrisConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  const mockBFLabelsConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_LABELS_MAP');
  const mockAdvancedFieldsConstant = getMockedImportedConstant(BibframeMappingConstants, 'ADVANCED_FIELDS');

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

  describe('getAdvancedValuesField', () => {
    test('returns mapped value', () => {
      const uriBFLite = 'testUriBFLite';
      const valueUri = 'testValueUri';
      mockAdvancedFieldsConstant({ testUriBFLite: { valueUri } });

      const result = getAdvancedValuesField(uriBFLite);

      expect(result).toBe(valueUri);
    });

    test('returns undefined', () => {
      const result = getAdvancedValuesField();

      expect(result).toBeUndefined();
    });
  });

  describe('generateAdvancedFieldObject', () => {
    test('returns mapped value', () => {
      const advancedValueField = 'testUriBFLite';
      const label = 'testUriBFLite';
      const testResult = { testUriBFLite: ['testUriBFLite'] };

      const result = generateAdvancedFieldObject({ advancedValueField, label });

      expect(result).toEqual(testResult);
    });

    test('returns undefined', () => {
      const result = generateAdvancedFieldObject({});

      expect(result).toBeUndefined();
    });
  });

  describe('generateUserValueObject', () => {
    test('returns an object which was generated from the nested entry', () => {
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

      const result = generateUserValueObject({ entry, type });

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

    test('returns work from within the instance entity', () => {
      const uriWithSelector = BibframeMappingConstants.BFLITE_URIS.INSTANTIATES;
      const hasRootWrapper = true;
      const testResult = { result: 'value' };
      jest.spyOn(SchemaHelper, 'getSelectedRecord').mockReturnValueOnce(testResult).mockReturnValueOnce(testResult);

      const result = generateRecordForDropdown({
        uriWithSelector,
        hasRootWrapper,
      });

      expect(result).toEqual(testResult);
    });
  });

  describe('generateUserValueContent', () => {
    test('returns a simple object for string', () => {
      const entry = 'testEntry';
      const type = 'testType' as AdvancedFieldType;
      const uriBFLite = 'uriBFLite';
      const testResult = { label: 'testEntry' };

      const result = generateUserValueContent({ entry, type, uriBFLite });

      expect(result).toEqual(testResult);
    });

    test('returns a generated object for record', () => {
      const entry = { key: 'testLabelValue' };
      const type = 'testType' as AdvancedFieldType;
      const uriBFLite = 'uriBFLite';
      const linkUri = 'testLinkUri';
      mockBFUrisConstant({ LINK: linkUri });
      const generatedUserValue = {
        label: 'testLabelValue',
        meta: {
          uri: linkUri,
          parentURI: linkUri,
          type,
        },
      };
      jest.spyOn(SchemaHelper, 'generateUserValueObject').mockReturnValue(generatedUserValue);

      const result = generateUserValueContent({ entry, type, uriBFLite });

      expect(result).toEqual(generatedUserValue);
    });
  });

  describe('getFilteredRecordData', () => {
    const valueTemplateRefs = ['testRef_1', 'testRef_2'];
    const templates = { testRef_1: {} as ResourceTemplate };
    const base = new Map();
    const path = ['testUuid_1', 'testUuid_2'];

    test('returns a list of template refs', () => {
      const uriBFLite = 'testUriBFLite';
      jest.spyOn(BibframeHelper, 'getUris').mockReturnValueOnce({ uriBFLite, uriWithSelector: uriBFLite });
      const selectedRecord = { testUriBFLite: {} };
      const testResult = ['testRef_1'];

      const result = getFilteredRecordData({ valueTemplateRefs, templates, base, path, selectedRecord });

      expect(result).toEqual(testResult);
    });

    test('returns an empty array', () => {
      jest
        .spyOn(BibframeHelper, 'getUris')
        .mockReturnValueOnce({ uriBFLite: undefined, uriWithSelector: 'testUriBFLite' });
      const selectedRecord = { testUriBFLite_2: {} };

      const result = getFilteredRecordData({ valueTemplateRefs, templates, base, path, selectedRecord });

      expect(result).toHaveLength(0);
    });
  });

  describe('generateCopiedGroupUuids', () => {
    test('returns a list of uuids', () => {
      jest
        .spyOn(BibframeHelper, 'getUris')
        .mockReturnValueOnce({ uriBFLite: 'testUriBFLite_1', uriWithSelector: 'testUriBFLite_1' })
        .mockReturnValueOnce({ uriBFLite: 'testUriBFLite_2', uriWithSelector: 'testUriBFLite_2' });
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('testUuid-1').mockReturnValueOnce('testUuid-2');
      const valueTemplateRefs = ['testRef_1', 'testRef_2'];
      const templates = {
        testRef_1: { resourceURI: 'testUri_1' } as ResourceTemplate,
        testRef_2: { resourceURI: 'testUri_2' } as ResourceTemplate,
      };
      const base = new Map();
      const path = ['testUuid_1', 'testUuid_2'];
      const selectedRecord = { testUriBFLite_1: [], testUriBFLite_2: [{}, {}] };
      const testResult = [[], ['testUuid-1', 'testUuid-2']];

      const result = generateCopiedGroupUuids({
        valueTemplateRefs,
        templates,
        base,
        path,
        selectedRecord,
      });

      expect(result).toEqual(testResult);
    });
  });

  describe('hasChildEntry', () => {
    const schema = new Map([
      ['testId_1', { id: 'testId_1' } as unknown as SchemaEntry],
      ['testId_2', { id: 'testId_2' } as unknown as SchemaEntry],
    ]);

    test('returns false if there is no "children" passed', () => {
      const result = hasChildEntry(schema);

      expect(result).toBeFalsy();
    });

    test('returns false if "children" array is empty', () => {
      const result = hasChildEntry(schema, []);

      expect(result).toBeFalsy();
    });

    test('returns false', () => {
      const result = hasChildEntry(schema, ['testId_3']);

      expect(result).toBeFalsy();
    });

    test('returns true', () => {
      const result = hasChildEntry(schema, ['testId_1']);

      expect(result).toBeTruthy();
    });
  });
});
