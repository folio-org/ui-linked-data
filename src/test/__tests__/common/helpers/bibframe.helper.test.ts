import * as BibframeHelper from '@src/common/helpers/bibframe.helper';
import * as BibframeMappingConstants from '@src/common/constants/bibframeMapping.constants';
import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';

describe('bibframe.helper', () => {
  const mockImportedConstant = getMockedImportedConstant(BibframeMappingConstants, 'BF2_TO_BFLITE_MAP');

  describe('getMappedBFLiteUri', () => {
    test('returns undefined', () => {
      mockImportedConstant({
        testBF20Uri_1: 'testBFLiteUri_1',
        testBF20Uri_2: 'testBFLiteUri_2',
      });
      const uri = 'testBF20Uri_3';

      const result = BibframeHelper.getMappedBFLiteUri(uri);

      expect(result).toBeUndefined();
    });

    test('returns mapped URI for string', () => {
      mockImportedConstant({
        testBF20Uri_1: 'testBFLiteUri_1',
      });
      const uri = 'testBF20Uri_1';

      const result = BibframeHelper.getMappedBFLiteUri(uri);

      expect(result).toBe('testBFLiteUri_1');
    });

    test('returns mapped URI for object', () => {
      mockImportedConstant({
        testBF20Uri_1: {
          testBF20NestedUri_1: 'testBFLiteNestedUri_1',
        },
      });
      const uri = 'testBF20Uri_1';
      const path = ['pathItem_1'];
      const schema = new Map([
        ['pathItem_1', { uri: 'testBF20NestedUri_1' } as SchemaEntry],
        ['pathItem_2', { uri: 'testBF20NestedUri_2' } as SchemaEntry],
      ]);

      const result = BibframeHelper.getMappedBFLiteUri(uri, schema, path);

      expect(result).toBe('testBFLiteNestedUri_1');
    });
  });

  describe('getUris', () => {
    function testGetUris(testResult: Record<string, string | undefined>, mapperUri?: string) {
      jest.spyOn(BibframeHelper, 'getMappedBFLiteUri').mockReturnValue(mapperUri);
      const uri = 'testBF20Uri_1';
      const schema = new Map([['pathItem_1', { uri: 'testBF20NestedUri_1' } as SchemaEntry]]);
      const path = ['pathItem_1'];

      const result = BibframeHelper.getUris({ uri, schema, path });

      expect(result).toEqual(testResult);
    }

    test('returns an object with uris', () => {
      testGetUris({ uriBFLite: 'testBFLiteUri', uriWithSelector: 'testBFLiteUri' }, 'testBFLiteUri');
    });

    test('returns an object with empty uriBFLite', () => {
      testGetUris({ uriBFLite: undefined, uriWithSelector: 'testBF20Uri_1' });
    });

    test('returns an object for duplicate bf2.0 uris', () => {
      const duplicateUri = 'http://id.loc.gov/ontologies/bibframe/contribution';
      const nextUri = 'http://id.loc.gov/ontologies/bibframe/Contribution';
      const resultUri = 'http://bibfra.me/vocab/lite/contributor';

      const result = BibframeHelper.getUris({ uri: duplicateUri, dataTypeURI: nextUri, schema: new Map() });
      const testResult = {
        uriBFLite: resultUri,
        uriWithSelector: resultUri,
      };

      expect(result).toEqual(testResult);
    });
  });

  describe('getSelectedBFLiteUri', () => {
    const schemaEntry = {
      id: 'testId',
      propertyURI: 'testUri',
      propertyLabel: 'test label',
      type: 'literal',
      valueConstraint: {
        valueDataType: {
          dataTypeURI: 'testDataTypeUri_1',
        },
      },
    } as PropertyTemplate;
    const uriBFLite = 'testUri';

    test('returns the passed uriBFLite', () => {
      const result = BibframeHelper.getSelectedBFLiteUri(schemaEntry, uriBFLite);

      expect(result).toBe(uriBFLite);
    });

    test('returns the mapped uri from the defined alternatives list', () => {
      const nonBFMappedGroup = {
        uri: 'testUri',
        data: {
          container: {
            key: 'testContainerKey',
            altKeys: {
              testDataTypeUri_1: 'testValue_1',
              testDataTypeUri_2: 'testValue_2',
            },
          },
        },
      };
      const result = BibframeHelper.getSelectedBFLiteUri(schemaEntry, uriBFLite, nonBFMappedGroup);

      expect(result).toBe('testValue_1');
    });

    test('returns the mapped uri', () => {
      const nonBFMappedGroup = {
        uri: 'testUri',
        data: {
          container: {
            key: 'testContainerKey',
          },
        },
      };
      const result = BibframeHelper.getSelectedBFLiteUri(schemaEntry, uriBFLite, nonBFMappedGroup);

      expect(result).toBe('testContainerKey');
    });
  });
});
