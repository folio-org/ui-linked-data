import { DEFAULT_SEARCH_BY } from '@/common/constants/search.constants';
import type { SearchTypeConfig } from '../../core/types';
import type { SearchTypeUIConfig } from '../types';
import { getValidSearchBy } from './getValidSearchBy.helper';

describe('getValidSearchBy', () => {
  const mockUIConfig: SearchTypeUIConfig = {
    searchableIndices: [
      { value: 'title', labelId: 'ld.title' },
      { value: 'author', labelId: 'ld.author' },
      { value: 'isbn', labelId: 'ld.isbn' },
    ],
  };

  const mockCoreConfig: SearchTypeConfig = {
    id: 'test-config',
    defaults: {
      searchBy: 'author',
    },
  };

  describe('with valid searchableIndices', () => {
    it('returns the searchBy value when it exists in valid indices', () => {
      expect(getValidSearchBy('title', mockUIConfig, mockCoreConfig)).toBe('title');
      expect(getValidSearchBy('author', mockUIConfig, mockCoreConfig)).toBe('author');
      expect(getValidSearchBy('isbn', mockUIConfig, mockCoreConfig)).toBe('isbn');
    });

    it('returns core config default when searchBy is not in valid indices', () => {
      expect(getValidSearchBy('invalid', mockUIConfig, mockCoreConfig)).toBe('author');
    });

    it('returns core config default when searchBy is undefined', () => {
      expect(getValidSearchBy(undefined, mockUIConfig, mockCoreConfig)).toBe('author');
    });
  });

  describe('without core config', () => {
    it('returns DEFAULT_SEARCH_BY when searchBy is undefined and no core config', () => {
      expect(getValidSearchBy(undefined, mockUIConfig)).toBe(DEFAULT_SEARCH_BY);
    });

    it('returns DEFAULT_SEARCH_BY when searchBy is invalid and no core config', () => {
      expect(getValidSearchBy('invalid', mockUIConfig)).toBe(DEFAULT_SEARCH_BY);
    });

    it('returns valid searchBy when it exists in valid indices', () => {
      expect(getValidSearchBy('title', mockUIConfig)).toBe('title');
    });
  });

  describe('with empty searchableIndices', () => {
    const emptyUIConfig: SearchTypeUIConfig = {
      searchableIndices: [],
    };

    it('returns searchBy value as-is when searchableIndices is empty', () => {
      expect(getValidSearchBy('anything', emptyUIConfig, mockCoreConfig)).toBe('anything');
    });

    it('returns core config default when searchBy is undefined', () => {
      expect(getValidSearchBy(undefined, emptyUIConfig, mockCoreConfig)).toBe('author');
    });
  });

  describe('with undefined searchableIndices', () => {
    const noIndicesUIConfig: SearchTypeUIConfig = {};

    it('returns searchBy value as-is when searchableIndices is undefined', () => {
      expect(getValidSearchBy('custom', noIndicesUIConfig, mockCoreConfig)).toBe('custom');
    });

    it('returns core config default when searchBy is undefined', () => {
      expect(getValidSearchBy(undefined, noIndicesUIConfig, mockCoreConfig)).toBe('author');
    });
  });
});
