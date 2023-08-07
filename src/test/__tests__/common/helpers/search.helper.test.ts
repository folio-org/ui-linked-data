import { formatKnownItemSearchData } from '@common/helpers/search.helper';

describe('search.helper', () => {
  describe('formatResult', () => {
    const mockData = {
      search_query: 'isbn=12345*',
      content: [
        {
          id: 'mock-id',
          title: 'mock-title',
          identifiers: [
            {
              value: 'mock-val',
              type: 'ISBN',
            },
          ],
          contributors: [
            {
              name: 'mock-name',
              primary: true,
            },
          ],
          publications: [
            {
              publisher: 'mock-publisher',
              dateOfPublication: 'mock-date',
            },
          ],
          editionStatement: 'mock-edition',
        },
      ],
    };

    test('returns formatted data for the correct arg', () => {
      const formatted = formatKnownItemSearchData(mockData);

      expect(formatted).toEqual([
        {
          id: {
            label: '12345',
          },
          title: {
            label: 'mock-title',
          },
          author: {
            label: 'mock-name',
          },
          date: {
            label: 'mock-date',
          },
          edition: {
            label: 'mock-edition',
          },
          __meta: {
            id: 'mock-id',
          },
        },
      ]);
    });
  });
});
