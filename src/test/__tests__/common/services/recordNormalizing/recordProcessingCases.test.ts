import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

import * as BibframeMappingConstants from '@/common/constants/bibframeMapping.constants';
import * as SchemaHelper from '@/common/helpers/schema.helper';
import * as RecordProcessingCases from '@/common/services/recordNormalizing/recordProcessingCases';

const mockedBFLiteUris = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');

jest.mock('@/common/helpers/schema.helper', () => ({
  getLookupLabelKey: jest.fn(),
}));

describe('recordProcessingCases', () => {
  const blockKey = 'block_1';
  const groupKey = 'group_1';
  const testLabel = 'testLabel';
  const fieldName = 'testFieldName';
  const linkBFLiteUri = 'linkBFLiteUri';
  const labelBFLiteUri = 'labelBFLiteUri';
  const creatorBFLiteUri = 'creatorBFLiteUri';
  const noteNonBFUri = '_notes';
  const nameFieldName = '_name';
  const labelFieldName = 'label';
  const languagesNonBFUri = '_languages';

  mockedBFLiteUris({ LINK: linkBFLiteUri, LABEL: labelBFLiteUri, CREATOR: creatorBFLiteUri });

  describe('wrapWithContainer', () => {
    const container = 'groupContainer_1';

    test('wrap a group with a new container', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [{ key_1: 'value 1' }, { key_1: 'value 2' }],
          group_2: {},
        },
        block_2: {},
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [container]: [
            {
              [groupKey]: { key_1: 'value 1' },
            },
            {
              [groupKey]: { key_1: 'value 2' },
            },
          ],
          group_2: {},
        },
        block_2: {},
      };

      RecordProcessingCases.wrapWithContainer(record, blockKey, groupKey, container);

      expect(record).toEqual(testResult);
    });

    test('wrap a group with the existing container', () => {
      const groupKey_3 = 'group_3';
      const record = {
        [blockKey]: {
          [container]: [{ [groupKey]: {} }],
          group_2: {},
          [groupKey_3]: [{}],
        },
        block_2: {},
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [container]: [{ [groupKey]: {} }, { [groupKey_3]: {} }],
          group_2: {},
        },
        block_2: {},
      };

      RecordProcessingCases.wrapWithContainer(record, blockKey, groupKey_3, container);

      expect(record).toEqual(testResult);
    });
  });

  describe('wrapSimpleLookupData', () => {
    test('updates a record with wrapped simple lookups data', () => {
      jest.spyOn(SchemaHelper, 'getLookupLabelKey').mockReturnValueOnce(testLabel);
      const record = {
        [blockKey]: {
          [groupKey]: ['testField_1', 'testField_2'],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [{ testLabel: ['testField_1'] }, { testLabel: ['testField_2'] }],
        },
      };

      RecordProcessingCases.wrapSimpleLookupData(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('notesMapping', () => {
    test('updates a record with "_notes" objects', () => {
      // With refactoring, we now use fixed "type" label for notes
      const record = {
        [blockKey]: {
          [noteNonBFUri]: [
            {
              label: ['testNoteLabel_1'],
              type: ['testNoteType_1'],
            },
            {
              label: ['testNoteLabel_2'],
              type: ['testNoteType_2'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [noteNonBFUri]: [
            {
              label: ['testNoteLabel_1'],
              type: [
                {
                  [linkBFLiteUri]: ['testNoteType_1'],
                  [labelBFLiteUri]: [''],
                },
              ],
            },
            {
              label: ['testNoteLabel_2'],
              type: [
                {
                  [linkBFLiteUri]: ['testNoteType_2'],
                  [labelBFLiteUri]: [''],
                },
              ],
            },
          ],
        },
      };

      RecordProcessingCases.notesMapping(record, blockKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('languagesMapping', () => {
    test('updates a record with "_languages" objects', () => {
      const record = {
        [blockKey]: {
          [languagesNonBFUri]: [
            {
              _codes: [
                {
                  [linkBFLiteUri]: ['testLanguageLink_1'],
                  [labelBFLiteUri]: ['testLanguageLabel_1'],
                },
              ],
              _types: ['testLanguageType_1'],
            },
            {
              _codes: [
                {
                  [linkBFLiteUri]: ['testLanguageLink_2'],
                  [labelBFLiteUri]: ['testLanguageLabel_2'],
                },
              ],
              _types: ['testLanguageType_2'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [languagesNonBFUri]: [
            {
              _codes: [
                {
                  [linkBFLiteUri]: ['testLanguageLink_1'],
                  [labelBFLiteUri]: ['testLanguageLabel_1'],
                },
              ],
              _types: 'testLanguageType_1',
            },
            {
              _codes: [
                {
                  [linkBFLiteUri]: ['testLanguageLink_2'],
                  [labelBFLiteUri]: ['testLanguageLabel_2'],
                },
              ],
              _types: 'testLanguageType_2',
            },
          ],
        },
      };

      RecordProcessingCases.languagesMapping(record, blockKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('hubLanguagesMapping', () => {
    const languageBFLiteUri = 'languageBFLiteUri';
    const termBFLiteUri = 'termBFLiteUri';
    const codeBFLiteUri = 'codeBFLiteUri';

    beforeEach(() => {
      mockedBFLiteUris({
        LINK: linkBFLiteUri,
        LABEL: labelBFLiteUri,
        LANGUAGES: languagesNonBFUri,
        LANGUAGE: languageBFLiteUri,
        TERM: termBFLiteUri,
        CODE: codeBFLiteUri,
      });
    });

    test('wraps Hub language data into _languages structure', () => {
      const record = {
        [blockKey]: {
          [languageBFLiteUri]: [
            {
              id: 'lang_id_1',
              [linkBFLiteUri]: ['testLanguageLink_1'],
              [termBFLiteUri]: ['testLanguageTerm_1'],
              [codeBFLiteUri]: ['testLanguageCode_1'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [languagesNonBFUri]: [
            {
              [languageBFLiteUri]: {
                id: 'lang_id_1',
                [linkBFLiteUri]: ['testLanguageLink_1'],
                [termBFLiteUri]: ['testLanguageTerm_1'],
                [codeBFLiteUri]: ['testLanguageCode_1'],
              },
            },
          ],
        },
      };

      RecordProcessingCases.hubLanguagesMapping(record, blockKey, languageBFLiteUri);

      expect(record).toEqual(testResult);
    });

    test('wraps multiple Hub language entries into _languages structure', () => {
      const record = {
        [blockKey]: {
          [languageBFLiteUri]: [
            {
              id: 'lang_id_1',
              [linkBFLiteUri]: ['testLanguageLink_1'],
              [termBFLiteUri]: ['testLanguageTerm_1'],
            },
            {
              id: 'lang_id_2',
              [linkBFLiteUri]: ['testLanguageLink_2'],
              [termBFLiteUri]: ['testLanguageTerm_2'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [languagesNonBFUri]: [
            {
              [languageBFLiteUri]: {
                id: 'lang_id_1',
                [linkBFLiteUri]: ['testLanguageLink_1'],
                [termBFLiteUri]: ['testLanguageTerm_1'],
              },
            },
            {
              [languageBFLiteUri]: {
                id: 'lang_id_2',
                [linkBFLiteUri]: ['testLanguageLink_2'],
                [termBFLiteUri]: ['testLanguageTerm_2'],
              },
            },
          ],
        },
      };

      RecordProcessingCases.hubLanguagesMapping(record, blockKey, languageBFLiteUri);

      expect(record).toEqual(testResult);
    });

    test('does nothing when language data is not present', () => {
      const record = {
        [blockKey]: {
          otherField: ['value'],
        },
      } as unknown as RecordEntry;

      RecordProcessingCases.hubLanguagesMapping(record, blockKey, languageBFLiteUri);

      expect(record).toEqual({
        [blockKey]: {
          otherField: ['value'],
        },
      });
    });
  });

  describe('extractValue', () => {
    test('updates a record with extracted value', () => {
      const source = 'testFieldName';
      const record = {
        [blockKey]: {
          [groupKey]: [{ [source]: 'testValue_1' }, { [source]: 'testValue_2' }],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: ['testValue_1', 'testValue_2'],
        },
      };

      RecordProcessingCases.extractValue(record, blockKey, groupKey, source);

      expect(record).toEqual(testResult);
    });
  });

  describe('extractDropdownOption', () => {
    test('updates a record with extracted dropdown options', () => {
      const lookupKey = 'lookupKey';
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              field_1: ['testValue_1'],
              [fieldName]: ['testFieldValue_2'],
              [lookupKey]: [{ id: 'id_1', label: 'label_1' }],
            },
            {
              field_2: ['testValue_3'],
              [fieldName]: ['testFieldValue_4'],
              [lookupKey]: [{ id: 'id_2', label: 'label_2' }],
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              testFieldValue_2: {
                field_1: ['testValue_1'],
                [lookupKey]: [{ id: 'id_1', label: ['label_1'] }],
              },
            },
            {
              testFieldValue_4: {
                field_2: ['testValue_3'],
                [lookupKey]: [{ id: 'id_2', label: ['label_2'] }],
              },
            },
          ],
        },
      };

      RecordProcessingCases.extractDropdownOption(record, blockKey, groupKey, fieldName, lookupKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('processComplexLookup', () => {
    test('transforms entry with id and label', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: undefined,
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey, nameFieldName);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with id, label, and type', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
              type: 'TestType',
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: undefined,
              },
              _subclass: 'TestType',
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey, nameFieldName);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with id, label, and preferred status', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
              isPreferred: true,
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: true,
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey, nameFieldName);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with id, label, and preferred status, using label field name', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
              isPreferred: true,
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              label: {
                value: ['Test Label'],
                isPreferred: true,
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey, labelFieldName);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with roles', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Test Label',
              roles: ['role_1', 'role_2'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Test Label'],
                isPreferred: undefined,
              },
              roles: [
                {
                  [linkBFLiteUri]: ['role_1'],
                  [labelBFLiteUri]: [''],
                },
                {
                  [linkBFLiteUri]: ['role_2'],
                  [labelBFLiteUri]: [''],
                },
              ],
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey, nameFieldName);

      expect(record).toEqual(testResult);
    });

    test('transforms multiple entries with different combinations of fields', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'test_id_1',
              label: 'Label 1',
              type: 'Type_1',
              roles: ['role_1'],
            },
            {
              id: 'test_id_2',
              label: 'Label 2',
              isPreferred: true,
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['test_id_1'],
              _name: {
                value: ['Label 1'],
                isPreferred: undefined,
              },
              _subclass: 'Type_1',
              roles: [
                {
                  [linkBFLiteUri]: ['role_1'],
                  [labelBFLiteUri]: [''],
                },
              ],
            },
            {
              id: ['test_id_2'],
              _name: {
                value: ['Label 2'],
                isPreferred: true,
              },
            },
          ],
        },
      };

      RecordProcessingCases.processComplexLookup(record, blockKey, groupKey, nameFieldName);

      expect(record).toEqual(testResult);
    });
  });

  describe('processHubsComplexLookup', () => {
    test('transforms entry with hub data containing rdfLink and label as strings', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              _relation: 'relation_1',
              _hub: {
                rdfLink: 'test_hub_uri_1',
                label: 'Hub Label 1',
              },
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: [],
              _relation: 'relation_1',
              _hub: {
                value: ['Hub Label 1'],
                uri: ['test_hub_uri_1'],
                sourceType: 'libraryOfCongress',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processHubsComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms multiple entries with different hub data', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              _relation: 'relation_1',
              _hub: {
                rdfLink: 'test_hub_uri_1',
                label: 'Hub Label 1',
              },
            },
            {
              _relation: 'relation_2',
              _hub: {
                rdfLink: 'test_hub_uri_2',
                label: 'Hub Label 2',
              },
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: [],
              _relation: 'relation_1',
              _hub: {
                value: ['Hub Label 1'],
                uri: ['test_hub_uri_1'],
                sourceType: 'libraryOfCongress',
              },
            },
            {
              id: [],
              _relation: 'relation_2',
              _hub: {
                value: ['Hub Label 2'],
                uri: ['test_hub_uri_2'],
                sourceType: 'libraryOfCongress',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processHubsComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with empty hub data', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              _relation: 'relation_1',
              _hub: {
                rdfLink: undefined,
                label: undefined,
              },
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: [],
              _relation: 'relation_1',
              _hub: {
                value: [],
                uri: [],
              },
            },
          ],
        },
      };

      RecordProcessingCases.processHubsComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with id and label for local source', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              _relation: 'relation_1',
              _hub: {
                id: 'local_id_123',
                label: 'Local Hub Label',
              },
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['local_id_123'],
              _relation: 'relation_1',
              _hub: {
                value: ['Local Hub Label'],
                uri: [],
                id: ['local_id_123'],
                sourceType: 'local',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processHubsComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms entry with complex relation data', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              _relation: {
                type: 'complex',
                subtype: 'nested',
              },
              _hub: {
                rdfLink: 'test_hub_uri_1',
                label: 'Hub Label 1',
              },
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: [],
              _relation: {
                type: 'complex',
                subtype: 'nested',
              },
              _hub: {
                value: ['Hub Label 1'],
                uri: ['test_hub_uri_1'],
                sourceType: 'libraryOfCongress',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processHubsComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms existing LoC hub with id (saved hub) - preserves id inside _hub', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              _relation: 'relation_1',
              _hub: {
                id: 'backend_generated_id_123',
                rdfLink: 'http://id.loc.gov/resources/hubs/abc123',
                label: 'Existing LoC Hub',
              },
            },
          ],
        },
      } as unknown as RecordEntry;
      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['backend_generated_id_123'],
              _relation: 'relation_1',
              _hub: {
                value: ['Existing LoC Hub'],
                uri: ['http://id.loc.gov/resources/hubs/abc123'],
                id: ['backend_generated_id_123'],
                sourceType: 'libraryOfCongress',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processHubsComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });
  });

  describe('processSubjectComplexLookup', () => {
    const hubUri = 'http://bibfra.me/vocab/lite/Hub';

    beforeEach(() => {
      mockedBFLiteUris({ HUB: hubUri, LINK: linkBFLiteUri, LABEL: labelBFLiteUri });
    });

    test('transforms subject entry and sets lookupType to authorities when types array does not include Hub', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'auth_id_1',
              label: 'Authority Subject',
              types: ['http://bibfra.me/vocab/lite/Authority'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['auth_id_1'],
              label: {
                value: ['Authority Subject'],
                isPreferred: undefined,
                lookupType: 'authorities',
                sourceType: 'local',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processSubjectComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms subject entry and sets lookupType to hubs when types array includes Hub', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'hub_id_1',
              label: 'Hub Subject',
              types: [hubUri, 'http://bibfra.me/vocab/lite/Topic'],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['hub_id_1'],
              label: {
                value: ['Hub Subject'],
                isPreferred: undefined,
                lookupType: 'hubs',
                sourceType: 'local',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processSubjectComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms subject entry and sets lookupType to authorities when types array is undefined', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'auth_id_2',
              label: 'Subject without types',
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['auth_id_2'],
              label: {
                value: ['Subject without types'],
                isPreferred: undefined,
                lookupType: 'authorities',
                sourceType: 'local',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processSubjectComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('transforms multiple subject entries with mixed Hub and Authority types', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'hub_id_1',
              label: 'Hub Subject',
              types: [hubUri],
            },
            {
              id: 'auth_id_1',
              label: 'Authority Subject',
              types: ['http://bibfra.me/vocab/lite/Topic'],
            },
            {
              id: 'hub_id_2',
              label: 'Another Hub',
              types: ['http://bibfra.me/vocab/lite/Work', hubUri],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['hub_id_1'],
              label: {
                value: ['Hub Subject'],
                isPreferred: undefined,
                lookupType: 'hubs',
                sourceType: 'local',
              },
            },
            {
              id: ['auth_id_1'],
              label: {
                value: ['Authority Subject'],
                isPreferred: undefined,
                lookupType: 'authorities',
                sourceType: 'local',
              },
            },
            {
              id: ['hub_id_2'],
              label: {
                value: ['Another Hub'],
                isPreferred: undefined,
                lookupType: 'hubs',
                sourceType: 'local',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processSubjectComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });

    test('preserves isPreferred attribute while adding lookupType', () => {
      const record = {
        [blockKey]: {
          [groupKey]: [
            {
              id: 'hub_id_1',
              label: 'Preferred Hub',
              isPreferred: true,
              types: [hubUri],
            },
          ],
        },
      } as unknown as RecordEntry;

      const testResult = {
        [blockKey]: {
          [groupKey]: [
            {
              id: ['hub_id_1'],
              label: {
                value: ['Preferred Hub'],
                isPreferred: true,
                lookupType: 'hubs',
                sourceType: 'local',
              },
            },
          ],
        },
      };

      RecordProcessingCases.processSubjectComplexLookup(record, blockKey, groupKey);

      expect(record).toEqual(testResult);
    });
  });
});
