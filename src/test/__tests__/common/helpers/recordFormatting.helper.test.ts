import * as RecordFormattingHelper from '@common/helpers/recordFormatting.helper';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import * as BibframeMappingConstants from '@common/constants/bibframeMapping.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { updateRecordForClassification, updateRecordForProviderPlace } from '@common/helpers/recordFormatting.helper';

describe('recordFormatting', () => {
  const testInstanceUri = 'testInstanceUri';
  const testWorkUri = 'testWorkUri';
  const mockTypeUriConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  const mockWorkToInstanceConstant = getMockedImportedConstant(BibframeConstants, 'WORK_TO_INSTANCE_FIELDS');
  const mockProvisionActivityConstant = getMockedImportedConstant(BibframeConstants, 'PROVISION_ACTIVITY_OPTIONS');
  const mockBFLiteUriConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  const mockNonBFRecordElementsConstant = getMockedImportedConstant(BibframeMappingConstants, 'NON_BF_RECORD_ELEMENTS');
  const mockNonBFRecordContainersConstant = getMockedImportedConstant(
    BibframeMappingConstants,
    'NON_BF_RECORD_CONTAINERS',
  );
  mockTypeUriConstant({ INSTANCE: testInstanceUri });
  mockWorkToInstanceConstant([]);
  mockProvisionActivityConstant(['testOption_1', 'testOption_2']);
  mockBFLiteUriConstant({
    INSTANCE: testInstanceUri,
    WORK: testWorkUri,
    NOTE: 'testNoteUri',
    NAME: 'testNameUri',
    LABEL: 'testLabelUri',
    SOURCE: 'testSourceUri',
    CREATOR: 'testCreatorUri',
    CONTRIBUTOR: 'testContributorUri',
    PROVIDER_PLACE: 'testProviderPlaceUri',
    CLASSIFICATION: 'testClassificationUri',
  });
  mockNonBFRecordElementsConstant({
    testNoteUri: { container: '_notes' },
    testCreatorUri: { container: 'roles' },
    testContributorUri: { container: 'roles' },
  });
  mockNonBFRecordContainersConstant({
    testCreatorUri: { container: '_creatorReference' },
    testContributorUri: { container: '_contributorReference' },
  });

  describe('formatRecord', () => {
    function testFormatRecord({
      parsedRecord,
      record,
      selectedRecordBlocks,
      testResult,
    }: {
      parsedRecord: ParsedRecord;
      testResult: Record<string, object | string>;
      record: RecordEntry | null;
      selectedRecordBlocks?: SelectedRecordBlocks | undefined;
    }) {
      const result = RecordFormattingHelper.formatRecord({ parsedRecord, record, selectedRecordBlocks });

      expect(result).toEqual(testResult);
    }

    test('returns formatted record data', () => {
      const parsedRecord = {
        [testInstanceUri]: {},
        [testWorkUri]: {},
      };
      const record = {
        resource: {
          [testInstanceUri]: {
            testWorkReferenceKey: [
              {
                id: ['testWorkReferenceId'],
                fieldUri_1: [],
                fieldUri_2: [],
              },
            ],
          },
        },
      } as unknown as RecordEntry;
      const selectedRecordBlocks = {
        block: testInstanceUri,
        reference: {
          key: 'testWorkReferenceKey',
          uri: 'testWorkReferenceUri',
        },
      };
      const testResult = {
        resource: {
          [testInstanceUri]: {
            testWorkReferenceKey: [{ id: ['testWorkReferenceId'] }],
          },
        },
      };

      testFormatRecord({ parsedRecord, record, selectedRecordBlocks, testResult });
    });

    test('returns formatted record data without references', () => {
      const parsedRecord = {
        [testInstanceUri]: {
          testFieldUri_1: [],
          testFieldUri_2: [],
        },
        [testWorkUri]: {},
      };
      const record = {
        resource: {
          [testInstanceUri]: {
            testFieldUri_1: [],
            testFieldUri_2: [],
          },
        },
      } as unknown as RecordEntry;
      const selectedRecordBlocks = {
        block: testInstanceUri,
        reference: {
          key: 'testWorkReferenceKey',
          uri: 'testWorkReferenceUri',
        },
      };

      testFormatRecord({ parsedRecord, record, selectedRecordBlocks, testResult: record });
    });

    test('returns default formatted record', () => {
      const parsedRecord = {
        [testInstanceUri]: {},
      };
      const testResult = {
        resource: {},
      };

      testFormatRecord({ parsedRecord, record: null, testResult });
    });
  });

  describe('updateRecordWithRelationshipDesignator', () => {
    const fieldUris = ['testCreatorUri', 'testContributorUri'];
    type RecordValue = Record<string, RecursiveRecordSchema | RecursiveRecordSchema[]>;

    test('returns an updated records list with "roles" subfield', () => {
      const record = {
        testWorkUri: {
          testCreatorUri: [
            {
              dropdownOptionUri_1: {
                testNameUri: [
                  {
                    id: ['testId_1'],
                    label: 'subfield value 1',
                  },
                ],
              },
              roles: ['testRoleUri_1'],
            },
          ],
          testFieldUri_1: ['field value'],
        },
      } as unknown as RecordValue;
      const testResult = {
        testWorkUri: {
          _creatorReference: [
            {
              id: 'testId_1',
              roles: ['testRoleUri_1'],
            },
          ],
          testFieldUri_1: ['field value'],
        },
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

  describe('updateRecordForProviderPlace', () => {
    it('does not modify the record if no Provider place data exists', () => {
      const record = {
        testInstanceUri: {
          testItem_1: [],
          testItem_2: [],
        },
      };

      const result = updateRecordForProviderPlace(record);

      expect(result).toEqual(record);
    });

    it('updates Provider place data with name from Label', () => {
      const record = {
        testInstanceUri: {
          testOption_1: [
            {
              testProviderPlaceUri: [{ testLabelUri: 'Test Label' }],
            },
          ],
        },
      } as unknown as Record<string, RecursiveRecordSchema>;
      const testResult = {
        testInstanceUri: {
          testOption_1: [
            {
              testProviderPlaceUri: [
                {
                  testLabelUri: 'Test Label',
                  testNameUri: 'Test Label',
                },
              ],
            },
          ],
        },
      };

      const result = updateRecordForProviderPlace(record);

      expect(result).toEqual(testResult);
    });
  });

  describe('updateRecordForClassification', () => {
    it('updates the classification data with source information', () => {
      const record = {
        testWorkUri: {
          testClassificationUri: [
            {
              option_1: {
                prop_1: ['value 1'],
              },
            },
            {
              option_2: {
                prop_2: ['value 2'],
              },
            },
          ],
        },
      } as unknown as Record<string, RecursiveRecordSchema>;
      const testResult = {
        testWorkUri: {
          testClassificationUri: [
            {
              prop_1: ['value 1'],
              testSourceUri: ['option_1'],
            },
            {
              prop_2: ['value 2'],
              testSourceUri: ['option_2'],
            },
          ],
        },
      };

      const result = updateRecordForClassification(record);

      expect(result).toEqual(testResult);
    });

    it('handles empty classification data', () => {
      const record = {
        testWorkUri: {
          testClassificationUri: [],
        },
      };

      const result = updateRecordForClassification(record);

      expect(result).toEqual(record);
    });

    it('handles missing Classification component', () => {
      const mockRecord = {
        testWorkUri: [
          {
            testProp_1: [],
            testProp_2: [],
          },
        ],
      };

      const result = updateRecordForClassification(mockRecord);

      expect(result).toEqual(mockRecord);
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
