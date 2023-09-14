import { getMappedBFLiteUri } from '@src/common/helpers/bibframe.helper';
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

      const result = getMappedBFLiteUri(uri);

      expect(result).toBeUndefined();
    });

    test('returns mapped URI for string', () => {
      mockImportedConstant({
        testBF20Uri_1: 'testBFLiteUri_1',
      });
      const uri = 'testBF20Uri_1';

      const result = getMappedBFLiteUri(uri);

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

      const result = getMappedBFLiteUri(uri, schema, path);

      expect(result).toBe('testBFLiteNestedUri_1');
    });
  });
});
