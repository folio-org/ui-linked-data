import * as SchemaHelper from '@common/helpers/schema.helper';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { generateTwinChildrenKey } from '@common/helpers/schema.helper';

describe('schema.helper', () => {
  const {
    getLookupLabelKey,
    getAdvancedValuesField,
    generateAdvancedFieldObject,
    hasChildEntry,
    checkGroupIsNonBFMapped,
    selectNonBFMappedGroupData,
    findParentEntryByProperty,
    getHtmlIdForEntry,
  } = SchemaHelper;
  const mockBFUrisConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  const mockBFLabelsConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_LABELS_MAP');
  const mockAdvancedFieldsConstant = getMockedImportedConstant(BibframeMappingConstants, 'ADVANCED_FIELDS');
  const mockNonBFGroupTypeConstant = getMockedImportedConstant(BibframeMappingConstants, 'NON_BF_GROUP_TYPE');

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

  describe('checkGroupIsNonBFMapped', () => {
    const propertyURI = 'testUri';
    const nonBFGroupType = {
      testUri: {
        container: { key: 'testContainer' },
        testKey_1: { key: 'testValue_1' },
      },
    };
    const mappedNonBFGroupType = {
      container: { key: 'testContainer' },
      testKey_1: { key: 'testValue_1' },
    };

    test('returns false if "propertyURI" is not passed', () => {
      const parentEntryType = AdvancedFieldType.block;
      const type = AdvancedFieldType.groupComplex;

      const result = checkGroupIsNonBFMapped({ parentEntryType, type });

      expect(result).toBeFalsy();
    });

    test('returns false if there is no non-BibFrame Lite mapped group type', () => {
      const parentEntryType = AdvancedFieldType.block;
      const type = AdvancedFieldType.groupComplex;
      jest.spyOn(SchemaHelper, 'getMappedNonBFGroupType').mockReturnValueOnce(undefined);

      const result = checkGroupIsNonBFMapped({ propertyURI, parentEntryType, type });

      expect(result).toBeFalsy();
    });

    test('returns false if the parent entry type is not "block"', () => {
      const parentEntryType = AdvancedFieldType.group;
      const type = AdvancedFieldType.groupComplex;
      mockNonBFGroupTypeConstant(nonBFGroupType);
      jest.spyOn(SchemaHelper, 'getMappedNonBFGroupType').mockReturnValueOnce(mappedNonBFGroupType);

      const result = checkGroupIsNonBFMapped({ propertyURI, parentEntryType, type });

      expect(result).toBeFalsy();
    });

    test('returns false if the entry type is not "groupComplex"', () => {
      const parentEntryType = AdvancedFieldType.block;
      const type = AdvancedFieldType.group;
      mockNonBFGroupTypeConstant(nonBFGroupType);
      jest.spyOn(SchemaHelper, 'getMappedNonBFGroupType').mockReturnValueOnce(mappedNonBFGroupType);

      const result = checkGroupIsNonBFMapped({ propertyURI, parentEntryType, type });

      expect(result).toBeFalsy();
    });

    test('returns true', () => {
      const parentEntryType = AdvancedFieldType.block;
      const type = AdvancedFieldType.groupComplex;
      mockNonBFGroupTypeConstant(nonBFGroupType);
      jest.spyOn(SchemaHelper, 'getMappedNonBFGroupType').mockReturnValueOnce(mappedNonBFGroupType);

      const result = checkGroupIsNonBFMapped({ propertyURI, parentEntryType, type });

      expect(result).toBeTruthy();
    });
  });

  describe('selectNonBFMappedGroupData', () => {
    test('returns an object with both undefined values', () => {
      jest.spyOn(SchemaHelper, 'getMappedNonBFGroupType').mockReturnValueOnce(undefined);
      jest.spyOn(SchemaHelper, 'checkGroupIsNonBFMapped').mockReturnValueOnce(false);
      const propertyURI = 'testPropertyURI';
      const type = AdvancedFieldType.groupComplex;
      const parentEntryType = AdvancedFieldType.block;
      const testResult = {
        selectedNonBFRecord: undefined,
        nonBFMappedGroup: undefined,
      };

      const result = selectNonBFMappedGroupData({
        propertyURI,
        type,
        parentEntryType,
      });

      expect(result).toEqual(testResult);
    });

    test('returns an object with "selectedNonBFRecord" and "nonBFMappedGroup" keys which have values', () => {
      jest.spyOn(SchemaHelper, 'getMappedNonBFGroupType').mockReturnValueOnce({
        container: { key: 'testContainer' },
        testKey_1: { key: 'testValue_1' },
      });
      jest.spyOn(SchemaHelper, 'checkGroupIsNonBFMapped').mockReturnValueOnce(true);
      const propertyURI = 'testPropertyURI';
      const type = AdvancedFieldType.groupComplex;
      const parentEntryType = AdvancedFieldType.block;
      const selectedRecord = {
        testContainer: [
          {
            recordKey_1: ['recordValue_1'],
          },
        ],
      };
      jest.spyOn(SchemaHelper, 'getRecordEntry').mockReturnValueOnce(selectedRecord);
      const testResult = {
        selectedNonBFRecord: [
          {
            recordKey_1: ['recordValue_1'],
          },
        ],
        nonBFMappedGroup: {
          uri: 'testPropertyURI',
          data: {
            container: { key: 'testContainer' },
            testKey_1: { key: 'testValue_1' },
          },
        },
      };

      const result = selectNonBFMappedGroupData({
        propertyURI,
        type,
        parentEntryType,
        selectedRecord,
      });

      expect(result).toEqual(testResult);
    });
  });

  describe('findParentEntryByProperty', () => {
    const schema = new Map([
      ['blockUuid', { uuid: 'blockUuid', path: ['blockUuid'], type: AdvancedFieldType.block } as SchemaEntry],
      [
        'groupUuid',
        { uuid: 'groupUuid', path: ['blockUuid', 'groupUuid'], type: AdvancedFieldType.group } as SchemaEntry,
      ],
      [
        'fieldUuid',
        {
          uuid: 'fieldUuid',
          path: ['blockUuid', 'groupUuid', 'fieldUuid'],
          type: AdvancedFieldType.literal,
        } as SchemaEntry,
      ],
    ]);
    const path = ['blockUuid', 'groupUuid', 'fieldUuid'];

    test('returns a schema entry', () => {
      const type = AdvancedFieldType.block;

      const result = findParentEntryByProperty({ schema, path, key: 'type', value: type });

      expect(result).toEqual({ uuid: 'blockUuid', path: ['blockUuid'], type: AdvancedFieldType.block });
    });

    test('returns null', () => {
      const type = AdvancedFieldType.groupComplex;

      const result = findParentEntryByProperty({ schema, path, key: 'type', value: type });

      expect(result).toBeNull();
    });
  });

  describe('getHtmlIdForEntry', () => {
    const schema = new Map([
      ['blockUuid', { uuid: 'blockUuid', path: ['blockUuid'], bfid: 'mockBfid' }],
      ['groupUuid', { uuid: 'groupUuid', path: ['blockUuid', 'groupUuid'], uri: 'mockUri' }],
      [
        'fieldUuid',
        {
          uuid: 'fieldUuid',
          path: ['blockUuid', 'groupUuid', 'fieldUuid'],
          uriBFLite: 'mockUriBFLite',
        },
      ],
    ]);
    const path = ['blockUuid', 'groupUuid', 'fieldUuid'];

    test('returns htmlId', () => {
      const htmlId = getHtmlIdForEntry({ path }, schema);

      expect(htmlId).toEqual('mockBfid::0__mockUri::0__mockUriBFLite::0');
    });
  });

  describe('generateTwinChildrenKey', () => {
    test('returns just URI when no valueDataType exists', () => {
      const entry = {
        uri: 'test:uri',
        constraints: {},
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri');
    });

    test('returns concatenated string with valueDataType when present', () => {
      const entry = {
        uri: 'test:uri',
        constraints: {
          valueDataType: {
            dataTypeURI: 'test:dataType',
          },
        },
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri$$test:dataType');
    });

    test('returns URI when constraints is undefined', () => {
      const entry = {
        uri: 'test:uri',
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri');
    });

    test('returns URI when valueDataType is empty object', () => {
      const entry = {
        uri: 'test:uri',
        constraints: {
          valueDataType: {},
        },
      } as SchemaEntry;

      const result = generateTwinChildrenKey(entry);

      expect(result).toBe('test:uri');
    });
  });
});
