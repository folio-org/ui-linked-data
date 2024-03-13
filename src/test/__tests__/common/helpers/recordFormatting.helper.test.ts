import * as RecordFormattingHelper from '@common/helpers/recordFormatting.helper';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

describe('recordFormatting', () => {
  const testInstanceUri = 'testInstanceUri';
  const testInstantiatesUri = 'testInstantiatesUri';
  const testInstantiatesToInstanceUri = 'testInstantiatesToInstanceUri';
  const mockTypeUriConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  const mockInstantiatesToInstanceConstant = getMockedImportedConstant(
    BibframeConstants,
    'INSTANTIATES_TO_INSTANCE_FIELDS',
  );
  const mockBFLiteUriConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  const mockNonBFRecordElementsConstant = getMockedImportedConstant(BibframeMappingConstants, 'NON_BF_RECORD_ELEMENTS');
  mockTypeUriConstant({ INSTANCE: testInstanceUri });
  mockInstantiatesToInstanceConstant([]);
  mockBFLiteUriConstant({
    INSTANTIATES: testInstantiatesUri,
    NOTE: 'testNoteUri',
    CREATOR: 'testCreatorUri',
    CONTRIBUTOR: 'testContributorUri',
  });
  mockNonBFRecordElementsConstant({
    testNoteUri: { container: '_notes' },
    testCreatorUri: { container: '_roles' },
    testContributorUri: { container: '_roles' },
  });

  describe('formatRecord', () => {
    function testFormatRecord(initialRecord: ParsedRecord, testResult: Record<string, object | string>) {
      const result = RecordFormattingHelper.formatRecordLegacy(initialRecord);

      expect(result).toEqual(testResult);
    }

    test('returns formatted record data', () => {
      const initialRecord = {
        [testInstanceUri]: {},
      };
      const testResult = {
        resource: {
          [testInstanceUri]: {},
        },
      };

      testFormatRecord(initialRecord, testResult);
    });

    test('embeds work entity into instance if there is data for work entity', () => {
      const workComponent = {
        testUri: 'testValue',
      };
      const initialRecord = {
        [testInstanceUri]: {},
        [testInstantiatesUri]: workComponent,
      };
      const testResult = {
        resource: {
          [testInstanceUri]: {
            [testInstantiatesUri]: [workComponent],
          },
        },
      };

      testFormatRecord(initialRecord, testResult);
    });

    test("doesn't embed work entity into instance if it's empty", () => {
      const workComponent = {};
      const initialRecord = {
        [testInstanceUri]: {},
        [testInstantiatesUri]: workComponent,
      };
      const testResult = {
        resource: {
          [testInstanceUri]: workComponent,
        },
      };

      testFormatRecord(initialRecord, testResult);
    });
  });

  describe('updateInstantiatesWithInstanceFields', () => {
    test('returns initial Instance object', () => {
      const instance = {
        [testInstantiatesUri]: [{}],
      } as unknown as Record<string, RecursiveRecordSchema>;

      const result = RecordFormattingHelper.updateInstantiatesWithInstanceFields(instance);

      expect(result).toEqual(instance);
    });

    test('returns updated Instance object that contained Instantiates', () => {
      mockInstantiatesToInstanceConstant([testInstantiatesToInstanceUri]);
      const instance = {
        [testInstantiatesUri]: [{ existingKey_1: ['existingUri_1'] }],
        [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
      } as unknown as Record<string, RecursiveRecordSchema[]>;
      const testResult = {
        [testInstantiatesUri]: [
          {
            existingKey_1: ['existingUri_1'],
            [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
          },
        ],
      };

      const result = RecordFormattingHelper.updateInstantiatesWithInstanceFields(instance);

      expect(result).toEqual(testResult);
    });

    test('returns initial Instance object that did not contain Instantiates', () => {
      mockInstantiatesToInstanceConstant([testInstantiatesToInstanceUri]);
      const instance = {
        [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
      } as unknown as Record<string, RecursiveRecordSchema[]>;
      const testResult = {
        [testInstantiatesUri]: [
          {
            [testInstantiatesToInstanceUri]: ['testUri_1', 'testUri_2'],
          },
        ],
      };

      const result = RecordFormattingHelper.updateInstantiatesWithInstanceFields(instance);

      expect(result).toEqual(testResult);
    });
  });

  describe('updateRecordWithDefaultNoteType', () => {
    test('returns initial record', () => {
      const record = {
        _notes: [
          {
            value: ['note description 1'],
            type: ['testType_1'],
          },
          {
            value: ['note description 2'],
            type: ['testType_2'],
          },
        ],
      };

      const result = RecordFormattingHelper.updateRecordWithDefaultNoteType(record);

      expect(result).toEqual(record);
    });

    test('returns a record with a default Note type', () => {
      const record = {
        _notes: [
          {
            value: ['note description 1'],
            type: ['testType_1'],
          },
          {
            value: ['note description 2'],
          },
        ],
      } as Record<string, RecursiveRecordSchema[]>;
      const testResult = {
        _notes: [
          {
            value: ['note description 1'],
            type: ['testType_1'],
          },
          {
            value: ['note description 2'],
            type: ['testNoteUri'],
          },
        ],
      };

      const result = RecordFormattingHelper.updateRecordWithDefaultNoteType(record);

      expect(result).toEqual(testResult);
    });
  });

  describe('updateRecordWithRelationshipDesignator', () => {
    const fieldUris = ['testCreatorUri', 'testContributorUri'];
    type RecordValue = Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>;

    test('returns an updated records list with "_roles" subfield', () => {
      const record = {
        testInstantiatesUri: [
          {
            testCreatorUri: [
              {
                dropdownOptionUri_1: {
                  testSubFieldUri_1: ['subfield value 1'],
                },
                _roles: ['testRoleUri_1'],
              },
            ],
            testFieldUri_1: ['field value'],
          },
        ],
      } as unknown as RecordValue;
      const testResult = {
        testInstantiatesUri: [
          {
            testCreatorUri: [
              {
                dropdownOptionUri_1: {
                  testSubFieldUri_1: ['subfield value 1'],
                  _roles: ['testRoleUri_1'],
                },
              },
            ],
            testFieldUri_1: ['field value'],
          },
        ],
      };

      const result = RecordFormattingHelper.updateRecordWithRelationshipDesignator(record, fieldUris);

      expect(result).toEqual(testResult);
    });

    test('returns an entire records list', () => {
      const record = {
        testFieldUri_1: ['testValue'],
      } as unknown as RecordValue;

      const result = RecordFormattingHelper.updateRecordWithRelationshipDesignator(record, fieldUris);

      expect(result).toEqual(record);
    });
  });

  describe('getNonBFMapElemByContainerKey', () => {
    const containerKey = 'testContainerAltKey_1';

    test('returns an object with all undefined values', () => {
      const nonMappedGroup = {
        testGroup_1: {
          container: {
            key: 'testContainerKey_1',
          },
        },
        testGroup_2: {
          container: {
            key: 'testContainerKey_2',
          },
        },
      };
      const testResult = { key: undefined, value: undefined };

      const result = RecordFormattingHelper.getNonBFMapElemByContainerKey(nonMappedGroup, containerKey);

      expect(result).toEqual(testResult);
    });

    test('returns an object with selected "key" and "value" properties', () => {
      const nonMappedGroup = {
        testGroup_1: {
          container: {
            key: 'testContainerKey_1',
            altKeys: {
              bf2Key_1: 'testContainerAltKey_1',
              bf2Key_2: 'testContainerAltKey_2',
            },
          },
        },
        testGroup_2: {
          container: {
            key: 'testContainerKey_2',
          },
        },
      };
      const testResult = {
        key: 'testGroup_1',
        value: {
          container: {
            key: 'testContainerKey_1',
            altKeys: {
              bf2Key_1: 'testContainerAltKey_1',
              bf2Key_2: 'testContainerAltKey_2',
            },
          },
        },
      };

      const result = RecordFormattingHelper.getNonBFMapElemByContainerKey(nonMappedGroup, containerKey);

      expect(result).toEqual(testResult);
    });
  });
});
