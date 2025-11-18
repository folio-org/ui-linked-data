import { getMockedImportedConstant } from '@src/test/__mocks__/common/constants/constants.mock';
import { SearchableIndexQuerySelector } from '@common/constants/complexLookup.constants';
import * as SearchConstants from '@common/constants/search.constants';
import { buildSearchQuery } from './authorities';

describe('buildSearchQuery', () => {
  const mockImportedConstant = getMockedImportedConstant(SearchConstants, 'SEARCH_QUERY_VALUE_PARAM');
  mockImportedConstant('MOCK_SEARCH_VALUE');

  const searchBy = 'title' as SearchableIndexType;
  const value = 'test';

  it('returns undefined when searchBy key is not in map', () => {
    const map = {
      author: {
        [SearchableIndexQuerySelector.Query]: 'author:MOCK_SEARCH_VALUE',
      },
    } as SearchableIndexEntries;

    const result = buildSearchQuery({
      map,
      searchBy,
      value,
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined when selector is not present in searchableIndex', () => {
    const map = {
      title: {
        [SearchableIndexQuerySelector.Prev]: 'title:MOCK_SEARCH_VALUE',
      },
    } as SearchableIndexEntries;

    const result = buildSearchQuery({
      map,
      searchBy,
      value,
    });

    expect(result).toBeUndefined();
  });

  it('replaces SEARCH_QUERY_VALUE_PARAM with value correctly', () => {
    const map = {
      title: {
        [SearchableIndexQuerySelector.Query]: 'title:MOCK_SEARCH_VALUE',
      },
    } as SearchableIndexEntries;

    const result = buildSearchQuery({
      map,
      searchBy,
      value,
    });

    expect(result).toBe('title:test');
  });

  it('uses custom selector if provided', () => {
    const map = {
      title: {
        customSelector: 'custom:title:MOCK_SEARCH_VALUE',
      },
    } as SearchableIndexEntries;

    const result = buildSearchQuery({
      map,
      selector: 'customSelector' as SearchableIndexQuerySelectorType,
      searchBy,
      value: 'test',
    });

    expect(result).toBe('custom:title:test');
  });

  it('replaces SEARCH_QUERY_VALUE_PARAM with an empty string when value is empty', () => {
    const map = {
      title: {
        [SearchableIndexQuerySelector.Query]: 'title:MOCK_SEARCH_VALUE',
      },
    } as SearchableIndexEntries;

    const result = buildSearchQuery({
      map,
      searchBy,
      value: '',
    });

    expect(result).toBe('title:');
  });
});
