import { formatRecordsListData } from '@common/helpers/recordsList.helper';

describe('recordsList', () => {
  describe('formatRecordsListData', () => {
    test('returns formatted data', () => {
      const data = [
        { id: 'testId_1', label: 'testLabel_1' },
        { id: 'testId_2', label: 'testLabel_2' },
      ];
      const testResult = [
        {
          title: { label: 'testLabel_1' },
          id: { label: 'testId_1' },
          __meta: { id: 'testId_1' },
        },
        {
          title: { label: 'testLabel_2' },
          id: { label: 'testId_2' },
          __meta: { id: 'testId_2' },
        },
      ];

      const result = formatRecordsListData(data);

      expect(result).toEqual(testResult);
    });
  });
});
