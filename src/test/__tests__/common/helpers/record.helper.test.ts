import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import * as RecordHelper from '@common/helpers/record.helper';
import * as BibframeConstants from '@src/common/constants/bibframe.constants';
import * as BibframeMappingConstants from '@src/common/constants/bibframeMapping.constants';

describe('record.helper', () => {
  const mockBlocksBFLiteConstant = getMockedImportedConstant(BibframeMappingConstants, 'BLOCKS_BFLITE');

  const testInstanceUri = 'testInstanceUri';
  const mockTypeUriConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  mockTypeUriConstant({ INSTANCE: testInstanceUri });

  interface UserValueContents {
    label: string | undefined;
  }

  describe('getEditingRecordBlocks', () => {
    test("returns an object with the record's blocks", () => {
      mockBlocksBFLiteConstant({
        INSTANCE: {
          uri: 'testInstanceUri',
          reference: {
            key: 'workReferenceKey',
            uri: 'testWorkUri',
          },
        },
        WORK: {
          uri: 'testWorkUri',
          reference: {
            key: 'instanceReferenceKey',
            uri: 'testInstanceUri',
          },
        },
      });
      const record = {
        testInstanceUri: {
          testFieldUri_1: [],
          testFieldUri_2: [],
          workReferenceKey: [
            {
              testWorkFieldUri_1: [],
              id: ['testWorkId'],
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        block: 'testInstanceUri',
        reference: {
          key: 'workReferenceKey',
          uri: 'testWorkUri',
        },
      };

      const result = RecordHelper.getEditingRecordBlocks(record);

      expect(result).toEqual(testResult);
    });
  });

  describe('getRecordTitle', () => {
    const mockMainTitle = '80085';
    const mockRecord = {
      testInstanceUri: {
        'http://bibfra.me/vocab/marc/title': [
          {
            'http://bibfra.me/vocab/marc/Title': {
              'http://bibfra.me/vocab/marc/mainTitle': [mockMainTitle],
            },
          },
        ],
      },
    };

    test('returns title', () => {
      expect(RecordHelper.getRecordTitle(mockRecord as unknown as RecordEntry)).toBe(mockMainTitle);
    });
  });

  describe('getRecordDependencies', () => {
    test("doesn't work if there's no record", () => {
      expect(RecordHelper.getRecordDependencies(null)).toBeFalsy();
    });

    test('returns record dependencies', () => {
      const record = {
        testInstanceUri: {
          testFieldUri_1: [],
          testFieldUri_2: [],
          workReferenceKey: [
            {
              testWorkFieldUri_1: [],
              id: ['testWorkId'],
            },
          ],
        },
      } as unknown as RecordEntry;

      jest.spyOn(RecordHelper, 'getEditingRecordBlocks').mockReturnValue({
        block: 'testInstanceUri',
        reference: {
          key: 'workReferenceKey',
          uri: 'testWorkUri',
        },
      });

      expect(RecordHelper.getRecordDependencies(record)).toEqual({
        entries: [{ id: ['testWorkId'], testWorkFieldUri_1: [] }],
        keys: { key: 'workReferenceKey', uri: 'testWorkUri' },
        type: undefined,
      });
    });
  });

  describe('hasAllEmptyValues', () => {
    test('returns true when all values have empty labels', () => {
      const values: UserValueContents[] = [{ label: '' }, { label: undefined }];

      const result = RecordHelper.hasAllEmptyValues(values);

      expect(result).toBe(true);
    });

    test('returns false when any value has a non-empty label', () => {
      const values: UserValueContents[] = [{ label: '' }, { label: 'Some content' }, { label: undefined }];

      const result = RecordHelper.hasAllEmptyValues(values);

      expect(result).toBe(false);
    });

    test('returns true for empty array', () => {
      const result = RecordHelper.hasAllEmptyValues([]);

      expect(result).toBe(true);
    });
  });

  describe('getRecordProfileId', () => {
    test('returns profileId for instance block', () => {
      const profileId = 123;
      const record = {
        resource: {
          testInstanceUri: {
            profileId,
          },
        },
      } as unknown as RecordEntry;
      jest
        .spyOn(RecordHelper, 'getEditingRecordBlocks')
        .mockReturnValue({ block: 'testInstanceUri', reference: {} as RecordReference });

      const result = RecordHelper.getRecordProfileId(record);

      expect(result).toBe(profileId);
    });

    test('returns undefined if no profileId', () => {
      const record = {
        resource: {
          testInstanceUri: {},
        },
      } as unknown as RecordEntry;
      jest
        .spyOn(RecordHelper, 'getEditingRecordBlocks')
        .mockReturnValue({ block: 'testInstanceUri', reference: {} as RecordReference });

      const result = RecordHelper.getRecordProfileId(record);

      expect(result).toBeUndefined();
    });

    test('returns undefined if no block', () => {
      const record = {
        resource: {},
      } as unknown as RecordEntry;
      jest
        .spyOn(RecordHelper, 'getEditingRecordBlocks')
        .mockReturnValue({ block: undefined, reference: {} as RecordReference });

      const result = RecordHelper.getRecordProfileId(record);

      expect(result).toBeUndefined();
    });

    test('returns undefined for null record', () => {
      const result = RecordHelper.getRecordProfileId(null);

      expect(result).toBeUndefined();
    });
  });

  describe('getAdjustedRecordContents', () => {
    const block = BibframeMappingConstants.BFLITE_URIS.INSTANCE;
    test('removes expected instance admin metadata', () => {
      const record = {
        [BibframeMappingConstants.BFLITE_URIS.INSTANCE]: {
          [BibframeMappingConstants.BFLITE_URIS.ADMIN_METADATA]: [
            {
              [BibframeMappingConstants.BFLITE_URIS.CONTROL_NUMBER]: [
                "123456789",
              ],
              [BibframeMappingConstants.BFLITE_URIS.CREATED_DATE]: [
                "2025-08-29",
              ],
              [BibframeMappingConstants.BFLITE_URIS.CATALOGING_AGENCY]: [
                "agency",
              ],
            },
          ],
        },
      } as unknown as RecordEntry<RecursiveRecordSchema>;
      const expected = {
        [BibframeMappingConstants.BFLITE_URIS.INSTANCE]: {
          [BibframeMappingConstants.BFLITE_URIS.ADMIN_METADATA]: [
            {
              [BibframeMappingConstants.BFLITE_URIS.CATALOGING_AGENCY]: [
                "agency",
              ],
            },
          ],
        },
      };

      const result = RecordHelper.getAdjustedRecordContents({record, block, asClone: true});
      expect(result.record).toMatchObject(expected);
    });

    test('does nothing when no admin metadata', () => {
      const record = {
        [BibframeMappingConstants.BFLITE_URIS.INSTANCE]: {
          [BibframeMappingConstants.BFLITE_URIS.ISSUANCE]: [
            "issuance",
          ],
        },
      } as unknown as RecordEntry<RecursiveRecordSchema>;

      const result = RecordHelper.getAdjustedRecordContents({record, block, asClone: true});
      expect(result.record).toMatchObject(record);
    });

    test('does nothing when admin metadata does not contain unique data', () => {
      const record = {
        [BibframeMappingConstants.BFLITE_URIS.INSTANCE]: {
          [BibframeMappingConstants.BFLITE_URIS.ADMIN_METADATA]: [
            {
              [BibframeMappingConstants.BFLITE_URIS.CATALOGING_AGENCY]: [
                "agency",
              ],
            },
          ],
        },
      } as unknown as RecordEntry<RecursiveRecordSchema>;

      const result = RecordHelper.getAdjustedRecordContents({record, block, asClone: true});
      expect(result.record).toMatchObject(record);
    });
  });
});
