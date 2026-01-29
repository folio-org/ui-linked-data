import * as BibframeConstants from '@/common/constants/bibframe.constants';
import * as BibframeMappingConstants from '@/common/constants/bibframeMapping.constants';
import * as RecordFormattingHelper from '@/common/helpers/recordFormatting.helper';
import { getMockedImportedConstant } from '@/test/__mocks__/common/constants/constants.mock';

describe('recordFormatting', () => {
  const testInstanceUri = 'testInstanceUri';
  const testWorkUri = 'testWorkUri';
  const mockTypeUriConstant = getMockedImportedConstant(BibframeConstants, 'TYPE_URIS');
  const mockBFLiteUriConstant = getMockedImportedConstant(BibframeMappingConstants, 'BFLITE_URIS');
  mockTypeUriConstant({ INSTANCE: testInstanceUri });
  mockBFLiteUriConstant({
    INSTANCE: testInstanceUri,
    WORK: testWorkUri,
    NOTE: 'testNoteUri',
    NAME: 'testNameUri',
    DATE: 'testDateUri',
    LABEL: 'testLabelUri',
    SOURCE: 'testSourceUri',
    CREATOR: 'testCreatorUri',
    CONTRIBUTOR: 'testContributorUri',
    PROVIDER_PLACE: 'testProviderPlaceUri',
    CLASSIFICATION: 'testClassificationUri',
    PUBLICATION: 'testPubUri',
    TITLE: 'testTitleUri',
    TITLE_CONTAINER: 'testTitleContainerUri',
    MAIN_TITLE: 'testMainTitleUri',
  });

  describe('formatDependeciesTable', () => {
    test('converts record dependencies into Rows', () => {
      expect(
        RecordFormattingHelper.formatDependeciesTable([
          {
            id: 'mockId',
            testTitleUri: [
              {
                testTitleContainerUri: {
                  testMainTitleUri: ['mockTitle'],
                },
              },
            ],
            testPubUri: [
              {
                testNameUri: ['mockPubName'],
                testDateUri: ['mockPubDate'],
              },
            ],
          },
        ])[0],
      ).toMatchObject({
        __meta: {
          id: 'mockId',
          key: 'mockId',
        },
        title: {
          label: 'mockTitle',
        },
        publisher: {
          label: 'mockPubName',
        },
        pubDate: {
          label: 'mockPubDate',
        },
      });
    });
  });
});
