import { getSearchPlaceholder } from '@common/helpers/search/placeholder.helper';
import { SearchIdentifiers } from '@common/constants/search.constants';
import { SearchableIndex } from '@common/constants/complexLookup.constants';

describe('getSearchPlaceholder', () => {
  const mockHubOptions = [
    {
      label: 'search.hubNameLeftAnchored',
      value: SearchableIndex.HubNameLeftAnchored,
      placeholder: 'ld.placeholder.startsWith',
    },
    {
      label: 'search.hubNameKeyword',
      value: SearchableIndex.HubNameKeyword,
      placeholder: '',
    },
  ];

  const mockAuthorityOptions = [SearchIdentifiers.TITLE, SearchIdentifiers.CONTRIBUTOR, SearchIdentifiers.ISBN];

  test('returns placeholder for Hub Name Left Anchored', () => {
    const result = getSearchPlaceholder(mockHubOptions, SearchableIndex.HubNameLeftAnchored);

    expect(result).toBe('ld.placeholder.startsWith');
  });

  test('returns empty placeholder for Hub Name Keyword', () => {
    const result = getSearchPlaceholder(mockHubOptions, SearchableIndex.HubNameKeyword);

    expect(result).toBe('');
  });

  test('returns first option placeholder when no searchBy is provided', () => {
    const result = getSearchPlaceholder(mockHubOptions);

    expect(result).toBe('ld.placeholder.startsWith');
  });

  test('returns empty string for authority options (no placeholder property)', () => {
    const result = getSearchPlaceholder(mockAuthorityOptions, SearchIdentifiers.TITLE);

    expect(result).toBe('');
  });

  test('returns empty string for undefined selectOptions', () => {
    const result = getSearchPlaceholder(undefined, SearchableIndex.HubNameLeftAnchored);

    expect(result).toBe('');
  });

  test('returns empty string for empty selectOptions array', () => {
    const result = getSearchPlaceholder([], SearchableIndex.HubNameLeftAnchored);

    expect(result).toBe('');
  });

  test('returns empty string when searchBy is not found in options', () => {
    const result = getSearchPlaceholder(mockHubOptions, SearchIdentifiers.TITLE);

    expect(result).toBe('');
  });

  test('handles mixed option types', () => {
    const mixedOptions = [
      SearchIdentifiers.TITLE,
      {
        label: 'search.hubNameKeyword',
        value: SearchableIndex.HubNameKeyword,
        placeholder: 'ld.test.placeholder',
      },
    ];

    const result_1 = getSearchPlaceholder(mixedOptions, SearchIdentifiers.TITLE);
    expect(result_1).toBe('');

    const result_2 = getSearchPlaceholder(mixedOptions, SearchableIndex.HubNameKeyword);
    expect(result_2).toBe('ld.test.placeholder');
  });
});
