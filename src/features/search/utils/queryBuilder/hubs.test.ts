import { SearchableIndex, SearchableIndexQuerySelector } from '@/common/constants/searchableIndex.constants';
import { buildHubSearchQuery } from './hubs';

describe('buildHubSearchQuery', () => {
  const mockValue = 'test search value';
  const mockParamName = 'searchParam';
  const mockAdditionalParam = { limit: '10' };
  const mockObjectConfig = {
    paramName: mockParamName,
    additionalParams: mockAdditionalParam,
  };
  const mockStringConfig = 'legacy-config-string';
  const mockSearchBy = SearchableIndex.HubNameKeyword;
  const mockMapWithObjectConfig = {
    [mockSearchBy]: {
      [SearchableIndexQuerySelector.Query]: mockObjectConfig,
    },
  } as HubSearchableIndicesMap;
  const mockMapWithStringConfig = {
    [mockSearchBy]: {
      [SearchableIndexQuerySelector.Query]: mockStringConfig,
    },
  } as HubSearchableIndicesMap;

  describe('with object-based configuration', () => {
    test('returns correct query result with object configuration', () => {
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: {
          [mockParamName]: mockValue,
          ...mockAdditionalParam,
        },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithObjectConfig,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: mockSearchBy,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });

    test('uses default selector when not provided', () => {
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: {
          [mockParamName]: mockValue,
          ...mockAdditionalParam,
        },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithObjectConfig,
        searchBy: mockSearchBy,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });

    test('handles configuration without additional params', () => {
      const mockConfigWithoutAdditional = {
        paramName: mockParamName,
      };
      const mockMapWithoutAdditional = {
        [mockSearchBy]: {
          [SearchableIndexQuerySelector.Query]: mockConfigWithoutAdditional,
        },
      } as HubSearchableIndicesMap;
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: {
          [mockParamName]: mockValue,
        },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithoutAdditional,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: mockSearchBy,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('with string-based configuration (legacy)', () => {
    test('returns correct query result with string configuration', () => {
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: { q: mockValue },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithStringConfig,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: mockSearchBy,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('fallback scenarios', () => {
    test('returns default fallback when map is undefined', () => {
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: { q: mockValue },
      };

      const result = buildHubSearchQuery({
        map: undefined as unknown as HubSearchableIndicesMap,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: mockSearchBy,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });

    test('returns default fallback when searchBy is not found in map', () => {
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: { q: mockValue },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithObjectConfig,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: SearchableIndex.Keyword,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });

    test('returns default fallback when selector is not found', () => {
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: { q: mockValue },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithObjectConfig,
        selector: SearchableIndexQuerySelector.Prev,
        searchBy: mockSearchBy,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });

    test('returns default fallback when config is null', () => {
      const mockMapWithNullConfig = {
        [mockSearchBy]: {
          [SearchableIndexQuerySelector.Query]: null,
        },
      } as unknown as HubSearchableIndicesMap;
      const expectedResult = {
        queryType: 'parameters',
        query: mockValue,
        urlParams: { q: mockValue },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithNullConfig,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: mockSearchBy,
        value: mockValue,
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('edge cases', () => {
    test('handles empty value', () => {
      const emptyValue = '';
      const expectedResult = {
        queryType: 'parameters',
        query: emptyValue,
        urlParams: {
          [mockParamName]: emptyValue,
          ...mockAdditionalParam,
        },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithObjectConfig,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: mockSearchBy,
        value: emptyValue,
      });

      expect(result).toEqual(expectedResult);
    });

    test('handles special characters in value', () => {
      const specialValue = 'test & "search" value';
      const expectedResult = {
        queryType: 'parameters',
        query: specialValue,
        urlParams: {
          [mockParamName]: specialValue,
          ...mockAdditionalParam,
        },
      };

      const result = buildHubSearchQuery({
        map: mockMapWithObjectConfig,
        selector: SearchableIndexQuerySelector.Query,
        searchBy: mockSearchBy,
        value: specialValue,
      });

      expect(result).toEqual(expectedResult);
    });
  });
});
