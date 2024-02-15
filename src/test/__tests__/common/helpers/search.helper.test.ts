export const itemSearchMockData = {
  searchQuery: 'isbn=12345*',
  content: [
    {
      id: 'mock-id',
      titles: [
        {
          value: 'mock-title',
        },
      ],
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

describe('search.helper', () => {
  describe('formatResult', () => {
    test('returns formatted data for the correct arg', () => {
      // TODO
      expect(true).toBeTruthy();
    });
  });
});
