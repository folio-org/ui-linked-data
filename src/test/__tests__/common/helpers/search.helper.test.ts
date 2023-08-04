import { formatKnownItemSearchData } from '@common/helpers/search.helper';

describe('search.helper', () => {
  describe('formatResult', () => {
    const mockData = {
      search_query: 'isbn=1234567890',
      content: [
        {
          id: 'sample-id',
          title: 'Sample Title',
          authors: [
            {
              name: 'Sample Name',
            },
          ],
          dateOfPublication: '1976',
          editionStatement: '2nd edition',
        },
      ],
    };

    test("returns null if an arg doesn't have the 'contents' property", () => {
      expect(formatKnownItemSearchData({})).toBeNull();
    });

    test('returns formatted data for the correct arg', () => {
      const formatted = formatKnownItemSearchData(mockData);

      expect(formatted).toEqual([{
        id: {
          label: '1234567890',
        },
        title: {
          label: 'Sample Title',
        },
        author: {
          label: 'Sample Name',
        },
        date: {
          label: '1976',
        },
        edition: {
          label: '2nd edition',
        },
        __meta: {
          id: 'sample-id',
        },
      }]);
    });
  });
});
