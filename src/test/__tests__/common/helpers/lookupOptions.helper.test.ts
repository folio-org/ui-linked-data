import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

import * as BibframeConstants from '@/common/constants/bibframeMapping.constants';
import * as LookupConstants from '@/common/constants/lookup.constants';
import * as LookupOptionsHelper from '@/common/helpers/lookupOptions.helper';

const {
  generateLabelWithCode,
  formatLookupOptions,
  filterLookupOptionsByMappedValue,
  filterLookupOptionsByParentBlock,
  getBFGroup,
} = LookupOptionsHelper;
const lookupData = [
  {
    label: 'testLabel_1',
    __isNew__: false,
    value: {
      id: 'testId_1',
      label: 'testLabel_1',
      uri: 'testUri_1',
    },
  },
  {
    label: 'testLabel_2',
    __isNew__: false,
    value: {
      id: 'testId_2',
      label: 'testLabel_2',
      uri: 'testUri_2',
    },
  },
  {
    label: 'testLabel_3',
    __isNew__: false,
    value: {
      id: 'testId_3',
      label: 'testLabel_3',
      uri: 'testUri_3',
    },
  },
];
const propertyURI = 'testPropertyUri';

const mockImportedLabelUriConstant = getMockedImportedConstant(LookupConstants, 'AUTHORITATIVE_LABEL_URI');
const mockSchemaLabelUriConstant = getMockedImportedConstant(LookupConstants, 'SCHEMA_LABEL_URI');
const mockIdKeyConstant = getMockedImportedConstant(LookupConstants, 'ID_KEY');
const mockValueKeyConstant = getMockedImportedConstant(LookupConstants, 'VALUE_KEY');
const mockBlankNodeTraitConstant = getMockedImportedConstant(LookupConstants, 'BLANK_NODE_TRAIT');

mockImportedLabelUriConstant('@testLabelUri');
mockSchemaLabelUriConstant('@testSchemaLabelUri');
mockIdKeyConstant('@id');
mockValueKeyConstant('@value');
mockBlankNodeTraitConstant(':_');

const mockBfliteTypesMap = getMockedImportedConstant(BibframeConstants, 'BFLITE_TYPES_MAP');
mockBfliteTypesMap({
  testGroup: {
    field: {
      uri: 'testPropertyUri',
    },
    data: {
      testUri_1: { uri: 'testUri_1' },
    },
  },
});

describe('lookupOptions.helper', () => {
  describe('generateLabelWithCode', () => {
    const label = 'testLabel_1';

    test('returns a label with a code', () => {
      const optionUri = 'testUri_1/code_1';
      const testResult = 'testLabel_1 (code_1)';

      const result = generateLabelWithCode(label, optionUri);

      expect(result).toBe(testResult);
    });

    test('returns a label without a code', () => {
      const optionUri = 'testUri_1_2';

      const result = generateLabelWithCode(label, optionUri);

      expect(result).toBe(label);
    });

    test('handles empty label gracefully', () => {
      const optionUri = 'testUri_1/code_1';
      const emptyLabel = '';

      const result = generateLabelWithCode(emptyLabel, optionUri);

      expect(result).toBe(' (code_1)');
    });

    test('handles empty optionUri gracefully', () => {
      const emptyOptionUri = '';

      const result = generateLabelWithCode(label, emptyOptionUri);

      expect(result).toBe(label);
    });

    test('handles multiple code separators in URI', () => {
      const optionUri = 'testUri_1/part/code_1';

      const result = generateLabelWithCode(label, optionUri);

      expect(result).toBe('testLabel_1 (code_1)');
    });
  });

  describe('formatLookupOptions', () => {
    test('returns empty array when no data is provided', () => {
      const result = formatLookupOptions();

      expect(result).toHaveLength(0);
    });

    test('returns formatted array with AUTHORITATIVE_LABEL_URI', () => {
      mockImportedLabelUriConstant('@testLabelUri');

      const data = [
        {
          '@id': 'id_1',
          '@type': ['type_1'],
          '@testLabelUri': [
            {
              '@id': 'testId_1',
              '@value': 'value_1',
              '@language': 'lang_1',
              '@type': 'type_1',
            },
          ],
        },
        {
          '@id': 'id_2/code_1',
          '@type': ['type_2'],
          '@testLabelUri': [
            {
              '@id': 'testId_2',
              '@value': 'value_2',
              '@language': 'lang_2',
              '@type': 'type_2',
            },
          ],
        },
        {
          '@id': 'parentUri_1:_test',
          '@type': ['type_2'],
          '@testLabelUri': [
            {
              '@id': 'parentUri_1:_test',
              '@value': 'value_2',
              '@language': 'lang_2',
              '@type': 'type_2',
            },
          ],
        },
      ] as unknown as LoadSimpleLookupResponseItem[];
      const parentUri = 'parentUri_1:_test';
      const testResult = [
        {
          __isNew__: false,
          label: 'value_1',
          value: {
            label: 'value_1',
            uri: 'id_1',
          },
        },
        {
          __isNew__: false,
          label: 'value_2 (code_1)',
          value: {
            label: 'value_2',
            uri: 'id_2/code_1',
          },
        },
      ] as unknown as LoadSimpleLookupResponseItem[];

      const result = formatLookupOptions(data, parentUri);

      expect(result).toEqual(testResult);
    });

    test('falls back to SCHEMA_LABEL_URI when AUTHORITATIVE_LABEL_URI is not available', () => {
      mockImportedLabelUriConstant('@testLabelUri');
      mockSchemaLabelUriConstant('@testSchemaLabelUri');

      const data = [
        {
          '@id': 'id_1',
          '@type': ['type_1'],
          '@testSchemaLabelUri': [
            {
              '@id': 'testId_1',
              '@value': 'schema_value_1',
              '@language': 'lang_1',
              '@type': 'type_1',
            },
          ],
        },
      ] as unknown as LoadSimpleLookupResponseItem[];

      const result = formatLookupOptions(data);

      expect(result[0].value.label).toBe('schema_value_1');
      expect(result[0].label).toBe('schema_value_1');
    });

    test('filters out items with blank node trait', () => {
      mockBlankNodeTraitConstant(':_');

      const data = [{ '@id': 'id_1' }, { '@id': 'id_2:_blank_node' }] as unknown as LoadSimpleLookupResponseItem[];

      const result = formatLookupOptions(data);

      expect(result).toHaveLength(1);
      expect(result[0].value.uri).toBe('id_1');
    });

    test('uses empty string as label when no label element is found', () => {
      const data = [{ '@id': 'id_without_label' }] as unknown as LoadSimpleLookupResponseItem[];

      const result = formatLookupOptions(data);

      expect(result[0].value.label).toBe('');
      expect(result[0].label).toBe('');
    });
  });

  describe('filterLookupOptionsByMappedValue', () => {
    test('returns an array with the entire lookup options if "propertyURI" is not provided', () => {
      const result = filterLookupOptionsByMappedValue(lookupData);

      expect(result).toEqual(lookupData);
    });

    test('returns an array with the filtered lookup options', () => {
      mockBfliteTypesMap({
        testGroup: {
          field: {
            uri: 'testPropertyUri',
          },
          data: {
            blLiteUri_1: { uri: 'testUri_1' },
          },
        },
      });

      const testResult = [
        {
          label: 'testLabel_1',
          __isNew__: false,
          value: {
            id: 'testId_1',
            label: 'testLabel_1',
            uri: 'testUri_1',
          },
        },
      ];

      const result = filterLookupOptionsByMappedValue(lookupData, propertyURI);

      expect(result).toEqual(testResult);
    });

    test('returns empty array when no options match the mapped values', () => {
      mockBfliteTypesMap({
        testGroup: {
          field: {
            uri: 'testPropertyUri',
          },
          data: {
            blLiteUri_1: { uri: 'nonMatchingUri' },
          },
        },
      });

      const result = filterLookupOptionsByMappedValue(lookupData, propertyURI);

      expect(result).toEqual([]);
    });

    test('uses parentGroupUri to find field when specified', () => {
      mockBfliteTypesMap({
        parentGroup: {
          field: {
            uri: 'parentUri',
          },
          fields: {
            childPropertyUri: {
              data: {
                childItem: { uri: 'testUri_2' },
              },
            },
          },
        },
      });

      const expectedResult = [
        {
          label: 'testLabel_2',
          __isNew__: false,
          value: {
            id: 'testId_2',
            label: 'testLabel_2',
            uri: 'testUri_2',
          },
        },
      ];

      const result = filterLookupOptionsByMappedValue(lookupData, 'childPropertyUri', 'parentGroup');

      expect(result).toEqual(expectedResult);
    });

    test('returns empty array when no bfGroup is found for the propertyURI', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValueOnce(undefined);

      const result = filterLookupOptionsByMappedValue(lookupData, 'nonExistentPropertyUri');

      expect(result).toEqual(lookupData);
    });
  });

  describe('filterLookupOptionsByParentBlock', () => {
    const parentBlockUri = 'testParentBlockUri_1';

    test('returns undefined if "lookupData" is not provided', () => {
      const result = filterLookupOptionsByParentBlock();

      expect(result).toBeUndefined();
    });

    test('returns an array with the entire lookup options if "propertyURI" is not provided', () => {
      const result = filterLookupOptionsByParentBlock(lookupData);

      expect(result).toEqual(lookupData);
    });

    test('returns an array with the entire lookup options if "parentBlockUri" is not provided', () => {
      const result = filterLookupOptionsByParentBlock(lookupData, propertyURI);

      expect(result).toEqual(lookupData);
    });

    test('returns an array with the filtered lookup options', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValue({
        field: {
          uri: 'testNotesUri',
        },
        data: {
          blLiteUri_1: { uri: 'testUri_1', parentBlock: { bfLiteUri: 'testParentBlockUri_1' } },
          blLiteUri_2: { uri: 'testUri_2', parentBlock: { bfLiteUri: 'testParentBlockUri_2' } },
        },
      });

      const testResult = [
        {
          label: 'testLabel_1',
          __isNew__: false,
          value: {
            id: 'testId_1',
            label: 'testLabel_1',
            uri: 'testUri_1',
          },
        },
      ];

      const result = filterLookupOptionsByParentBlock(lookupData, propertyURI, parentBlockUri);

      expect(result).toEqual(testResult);
    });

    test('filters options based on both URI match and parent block match', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValue({
        field: {
          uri: 'testNotesUri',
        },
        data: {
          blLiteUri_1: { uri: 'testUri_1', parentBlock: { bfLiteUri: 'testParentBlockUri_1' } },
          blLiteUri_2: { uri: 'testUri_2', parentBlock: { bfLiteUri: 'testParentBlockUri_1' } },
          blLiteUri_3: { uri: 'testUri_3', parentBlock: { bfLiteUri: 'testParentBlockUri_2' } },
        },
      });

      const testResult = [
        {
          label: 'testLabel_1',
          __isNew__: false,
          value: {
            id: 'testId_1',
            label: 'testLabel_1',
            uri: 'testUri_1',
          },
        },
        {
          label: 'testLabel_2',
          __isNew__: false,
          value: {
            id: 'testId_2',
            label: 'testLabel_2',
            uri: 'testUri_2',
          },
        },
      ];

      const result = filterLookupOptionsByParentBlock(lookupData, propertyURI, 'testParentBlockUri_1');

      expect(result).toEqual(testResult);
    });

    test('returns empty array when no options match the parent block', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValue({
        field: {
          uri: 'testNotesUri',
        },
        data: {
          blLiteUri_1: { uri: 'testUri_1', parentBlock: { bfLiteUri: 'nonMatchingParentBlock' } },
          blLiteUri_2: { uri: 'testUri_2', parentBlock: { bfLiteUri: 'anotherNonMatchingBlock' } },
        },
      });

      const result = filterLookupOptionsByParentBlock(lookupData, propertyURI, 'testParentBlockUri_1');

      expect(result).toEqual([]);
    });

    test('includes items without parentBlock if URI matches', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValue({
        field: {
          uri: 'testNotesUri',
        },
        data: {
          blLiteUri_1: { uri: 'testUri_1' },
          blLiteUri_2: { uri: 'testUri_2', parentBlock: { bfLiteUri: 'testParentBlockUri_2' } },
        },
      });

      const testResult = [
        {
          label: 'testLabel_1',
          __isNew__: false,
          value: {
            id: 'testId_1',
            label: 'testLabel_1',
            uri: 'testUri_1',
          },
        },
      ];

      const result = filterLookupOptionsByParentBlock(lookupData, propertyURI, 'anyParentBlockUri');

      expect(result).toEqual(testResult);
    });

    test('returns empty array when bfGroup is not found', () => {
      jest.spyOn(LookupOptionsHelper, 'getBFGroup').mockReturnValueOnce(undefined);

      const result = filterLookupOptionsByParentBlock(lookupData, 'nonExistentPropertyUri', 'testParentBlockUri_1');

      expect(result).toEqual(lookupData);
    });
  });

  describe('getBFGroup', () => {
    const mockBfliteTypesMap = getMockedImportedConstant(BibframeConstants, 'BFLITE_TYPES_MAP');

    test('returns field when property URI matches field URI', () => {
      mockBfliteTypesMap({
        testGroup: {
          field: {
            uri: 'testPropertyUri',
          },
          data: {
            blLiteUri_1: { uri: 'testUri_1' },
          },
        },
        anotherGroup: {
          field: {
            uri: 'anotherPropertyUri',
          },
          data: {
            blLiteUri_2: { uri: 'testUri_2' },
          },
        },
      });

      const result = getBFGroup(BibframeConstants.BFLITE_TYPES_MAP as FieldTypeMap, 'testPropertyUri');

      expect(result).toEqual({
        field: {
          uri: 'testPropertyUri',
        },
        data: {
          blLiteUri_1: { uri: 'testUri_1' },
        },
      });
    });

    test('returns field from parentGroupUri fields when property URI matches field in parent group', () => {
      mockBfliteTypesMap({
        parentGroup: {
          field: {
            uri: 'parentPropertyUri',
          },
          fields: {
            childPropertyUri: {
              data: {
                childItem: { uri: 'childUri' },
              },
            },
          },
          data: {
            parentItem: { uri: 'parentUri' },
          },
        },
      });

      const result = getBFGroup(BibframeConstants.BFLITE_TYPES_MAP as FieldTypeMap, 'childPropertyUri', 'parentGroup');

      expect(result).toEqual({
        data: {
          childItem: { uri: 'childUri' },
        },
      });
    });

    test('returns undefined when property URI does not match any field and no parent group is provided', () => {
      mockBfliteTypesMap({
        testGroup: {
          field: {
            uri: 'testPropertyUri',
          },
          data: {
            blLiteUri_1: { uri: 'testUri_1' },
          },
        },
      });

      const result = getBFGroup(BibframeConstants.BFLITE_TYPES_MAP as FieldTypeMap, 'nonExistentPropertyUri');

      expect(result).toBeUndefined();
    });

    test('returns undefined when property URI does not match any field in the parent group', () => {
      mockBfliteTypesMap({
        parentGroup: {
          field: {
            uri: 'parentPropertyUri',
          },
          fields: {
            childPropertyUri: {
              data: {
                childItem: { uri: 'childUri' },
              },
            },
          },
        },
      });

      const result = getBFGroup(
        BibframeConstants.BFLITE_TYPES_MAP as FieldTypeMap,
        'nonExistentPropertyUri',
        'parentGroup',
      );

      expect(result).toBeUndefined();
    });

    test('returns undefined when parent group does not exist', () => {
      mockBfliteTypesMap({
        existingGroup: {
          field: {
            uri: 'existingPropertyUri',
          },
        },
      });

      const result = getBFGroup(
        BibframeConstants.BFLITE_TYPES_MAP as FieldTypeMap,
        'propertyUri',
        'nonExistentParentGroup',
      );

      expect(result).toBeUndefined();
    });
  });
});
