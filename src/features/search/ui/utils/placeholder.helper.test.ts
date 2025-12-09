import { SearchIdentifiers } from '@/common/constants/search.constants';
import { SearchableIndex } from '@/common/constants/searchableIndex.constants';
import { getPlaceholderForProperty, getSearchPlaceholderLegacy } from './placeholder.helper';

describe('getSearchPlaceholderLegacy', () => {
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
    const result = getSearchPlaceholderLegacy(mockHubOptions, SearchableIndex.HubNameLeftAnchored);

    expect(result).toBe('ld.placeholder.startsWith');
  });

  test('returns empty placeholder for Hub Name Keyword', () => {
    const result = getSearchPlaceholderLegacy(mockHubOptions, SearchableIndex.HubNameKeyword);

    expect(result).toBe('');
  });

  test('returns first option placeholder when no searchBy is provided', () => {
    const result = getSearchPlaceholderLegacy(mockHubOptions);

    expect(result).toBe('ld.placeholder.startsWith');
  });

  test('returns empty string for authority options (no placeholder property)', () => {
    const result = getSearchPlaceholderLegacy(mockAuthorityOptions, SearchIdentifiers.TITLE);

    expect(result).toBe('');
  });

  test('returns empty string for undefined selectOptions', () => {
    const result = getSearchPlaceholderLegacy(undefined, SearchableIndex.HubNameLeftAnchored);

    expect(result).toBe('');
  });

  test('returns empty string for empty selectOptions array', () => {
    const result = getSearchPlaceholderLegacy([], SearchableIndex.HubNameLeftAnchored);

    expect(result).toBe('');
  });

  test('returns empty string when searchBy is not found in options', () => {
    const result = getSearchPlaceholderLegacy(mockHubOptions, SearchIdentifiers.TITLE);

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

    const result_1 = getSearchPlaceholderLegacy(mixedOptions, SearchIdentifiers.TITLE);
    expect(result_1).toBe('');

    const result_2 = getSearchPlaceholderLegacy(mixedOptions, SearchableIndex.HubNameKeyword);
    expect(result_2).toBe('ld.test.placeholder');
  });
});

describe('getPlaceholderForProperty', () => {
  const placeholder = 'ld.placeholder.processing';

  test('returns placeholder for ID property', () => {
    const property = 'http://bibfra.me/vocab/lite/createdDate';
    const result = getPlaceholderForProperty(property);
    expect(result).toEqual(placeholder);
  });

  test('returns placeholder for created date property', () => {
    const property = 'http://bibfra.me/vocab/library/controlNumber';
    const result = getPlaceholderForProperty(property);
    expect(result).toEqual(placeholder);
  });

  test('returns undefined for other property', () => {
    const property = 'another-property';
    const result = getPlaceholderForProperty(property);
    expect(result).toBeUndefined();
  });

  test('returns undefined for empty property', () => {
    const property = '';
    const result = getPlaceholderForProperty(property);
    expect(result).toBeUndefined();
  });

  test('returns undefined for undefined property', () => {
    const property = undefined;
    const result = getPlaceholderForProperty(property);
    expect(result).toBeUndefined();
  });
});
