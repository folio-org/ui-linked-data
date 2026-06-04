import { generateLookupQueryOptions } from './lookup.query';

const mockLoadSimpleLookup = jest.fn();
const mockFormatLookupOptions = jest.fn();

jest.mock('@/common/helpers/api.helper', () => ({
  loadSimpleLookup: (...args: unknown[]) => mockLoadSimpleLookup(...args),
}));

jest.mock('@/common/helpers/lookupOptions.helper', () => ({
  formatLookupOptions: (...args: unknown[]) => mockFormatLookupOptions(...args),
}));

const TEST_URI = 'https://id.loc.gov/vocabulary/test';

describe('generateLookupQueryOptions', () => {
  it('returns a queryKey containing the uri', () => {
    const { queryKey } = generateLookupQueryOptions(TEST_URI);

    expect(queryKey).toEqual(['lookup', TEST_URI]);
  });

  describe('queryFn', () => {
    it('returns an empty array when loadSimpleLookup returns a falsy value', async () => {
      mockLoadSimpleLookup.mockResolvedValue(null);

      const { queryFn } = generateLookupQueryOptions(TEST_URI);
      const result = await queryFn();

      expect(result).toEqual([]);
    });

    it('returns formatted options sorted alphabetically when loadSimpleLookup returns data', async () => {
      const rawData = [{ '@id': 'id_1' }, { '@id': 'id_2' }];
      const formattedOptions: MultiselectOption[] = [
        { label: 'Bravo', value: { id: 'id_2', label: 'Bravo', uri: 'uri_2' }, __isNew__: false },
        { label: 'Alpha', value: { id: 'id_1', label: 'Alpha', uri: 'uri_1' }, __isNew__: false },
      ];

      mockLoadSimpleLookup.mockResolvedValue(rawData);
      mockFormatLookupOptions.mockReturnValue(formattedOptions);

      const { queryFn } = generateLookupQueryOptions(TEST_URI);
      const result = await queryFn();

      expect(mockLoadSimpleLookup).toHaveBeenCalledWith(TEST_URI);
      expect(mockFormatLookupOptions).toHaveBeenCalledWith(rawData, TEST_URI);
      expect(result).toEqual([
        { label: 'Alpha', value: { id: 'id_1', label: 'Alpha', uri: 'uri_1' }, __isNew__: false },
        { label: 'Bravo', value: { id: 'id_2', label: 'Bravo', uri: 'uri_2' }, __isNew__: false },
      ]);
    });
  });
});
