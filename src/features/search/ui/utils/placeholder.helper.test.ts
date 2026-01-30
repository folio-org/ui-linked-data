import type { IntlShape } from 'react-intl';

import { SearchIdentifiers } from '@/common/constants/search.constants';
import { SearchableIndex } from '@/common/constants/searchableIndex.constants';

import { SearchTypeConfig } from '../../core';
import type { SearchTypeUIConfig } from '../types';
import { getPlaceholderForProperty, getSearchPlaceholder, getSearchPlaceholderLegacy } from './placeholder.helper';

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
});

describe('getSearchPlaceholder', () => {
  const mockFormatMessage = jest.fn();

  const mockConfig = {
    id: 'test',
    defaults: {
      searchBy: 'keyword',
    },
  };

  const mockUIConfigWithIndices: SearchTypeUIConfig = {
    searchableIndices: [
      { value: 'keyword', labelId: 'Keyword', placeholder: 'ld.placeholder.keyword' },
      { value: 'title', labelId: 'Title', placeholder: 'ld.placeholder.title' },
      { value: 'isbn', labelId: 'ISBN' }, // No placeholder
    ],
    ui: {
      placeholderId: 'ld.placeholder.generic',
    },
  };

  const mockUIConfigWithoutIndices: SearchTypeUIConfig = {
    ui: {
      placeholderId: 'ld.placeholder.generic',
    },
  };

  const mockUIConfigNoPlaceholder: SearchTypeUIConfig = {
    searchableIndices: [{ value: 'keyword', labelId: 'Keyword' }],
  };

  beforeEach(() => {
    mockFormatMessage.mockClear();
    mockFormatMessage.mockImplementation((obj: { id: string }) => `formatted_${obj.id}`);
  });

  it('returns generic placeholder when no searchable indices defined', () => {
    const result = getSearchPlaceholder({
      searchBy: 'keyword',
      config: mockConfig,
      uiConfig: mockUIConfigWithoutIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.generic');
    expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.placeholder.generic' });
  });

  it('returns undefined when no searchable indices and no generic placeholder', () => {
    const result = getSearchPlaceholder({
      searchBy: 'keyword',
      config: mockConfig,
      uiConfig: {} as SearchTypeUIConfig,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBeUndefined();
    expect(mockFormatMessage).not.toHaveBeenCalled();
  });

  it('returns placeholder for effective searchBy from store', () => {
    const result = getSearchPlaceholder({
      searchBy: 'title',
      config: mockConfig,
      uiConfig: mockUIConfigWithIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.title');
    expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.placeholder.title' });
  });

  it('uses config default searchBy when store searchBy is undefined', () => {
    const result = getSearchPlaceholder({
      searchBy: undefined,
      config: mockConfig,
      uiConfig: mockUIConfigWithIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.keyword');
    expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.placeholder.keyword' });
  });

  it('uses config default searchBy when store searchBy is empty string', () => {
    const result = getSearchPlaceholder({
      searchBy: '',
      config: mockConfig,
      uiConfig: mockUIConfigWithIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.keyword');
  });

  it('returns generic placeholder when index has no placeholder defined', () => {
    const result = getSearchPlaceholder({
      searchBy: 'isbn',
      config: mockConfig,
      uiConfig: mockUIConfigWithIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.generic');
    expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.placeholder.generic' });
  });

  it('returns undefined when index has no placeholder and no generic placeholder', () => {
    const result = getSearchPlaceholder({
      searchBy: 'keyword',
      config: mockConfig,
      uiConfig: mockUIConfigNoPlaceholder,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBeUndefined();
  });

  it('returns first index placeholder when searchBy not found in indices', () => {
    const result = getSearchPlaceholder({
      searchBy: 'unknown',
      config: mockConfig,
      uiConfig: mockUIConfigWithIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.keyword');
    expect(mockFormatMessage).toHaveBeenCalledWith({ id: 'ld.placeholder.keyword' });
  });

  it('uses first index placeholder as fallback for initial render', () => {
    const configNoDefaults = { id: 'test' } as SearchTypeConfig;
    const result = getSearchPlaceholder({
      searchBy: undefined,
      config: configNoDefaults,
      uiConfig: mockUIConfigWithIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.keyword');
  });

  it('returns generic placeholder when first index has no placeholder', () => {
    const uiConfigFirstNoPlaceholder = {
      searchableIndices: [
        { value: 'keyword', labelId: 'Keyword' },
        { value: 'title', labelId: 'Title', placeholder: 'ld.placeholder.title' },
      ],
      ui: {
        placeholderId: 'ld.placeholder.generic',
      },
    };

    const result = getSearchPlaceholder({
      searchBy: 'unknown',
      config: mockConfig,
      uiConfig: uiConfigFirstNoPlaceholder,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.generic');
  });

  it('handles config with no defaults gracefully', () => {
    const configNoDefaults = {} as SearchTypeConfig;
    const result = getSearchPlaceholder({
      searchBy: 'title',
      config: configNoDefaults,
      uiConfig: mockUIConfigWithIndices,
      formatMessage: mockFormatMessage as unknown as IntlShape['formatMessage'],
    });

    expect(result).toBe('formatted_ld.placeholder.title');
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
