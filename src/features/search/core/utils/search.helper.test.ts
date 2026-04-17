import { SearchQueryParams } from '@/common/constants/routes.constants';
import { SearchIdentifiers, TitleTypes } from '@/common/constants/search.constants';

import { formatItemSearchInstanceListData, generateSearchParamsState, removeBackslashes } from './search.helper';

describe('search.helper', () => {
  describe('formatItemSearchInstanceListData', () => {
    it('uses stable instance keys based on id', () => {
      const result = formatItemSearchInstanceListData([
        {
          id: 'instance_1',
          titles: [{ type: TitleTypes.Main, value: 'Primary Title' }],
          identifiers: [],
          publications: [],
        } as unknown as InstanceAsSearchResultDTO,
      ]);

      expect(result[0].__meta).toEqual({
        id: 'instance_1',
        key: 'instance_1',
      });
    });

    it('uses a deterministic fallback key when instance id is missing', () => {
      const firstResult = formatItemSearchInstanceListData([
        {
          id: '',
          titles: [{ type: TitleTypes.Main, value: 'Fallback Title' }],
          identifiers: [],
          publications: [],
        } as unknown as InstanceAsSearchResultDTO,
      ]);
      const secondResult = formatItemSearchInstanceListData([
        {
          id: '',
          titles: [{ type: TitleTypes.Main, value: 'Fallback Title' }],
          identifiers: [],
          publications: [],
        } as unknown as InstanceAsSearchResultDTO,
      ]);
      const [firstRow] = firstResult;
      const [secondRow] = secondResult;

      if (!firstRow || !secondRow || !firstRow.__meta || !secondRow.__meta) {
        throw new Error('Expected a formatted row');
      }

      expect(firstResult).toHaveLength(1);
      expect(secondResult).toHaveLength(1);
      expect(firstRow.__meta.key).toBe(secondRow.__meta.key);
      expect(firstRow.__meta.key).toContain('instance:');
      expect(firstRow.__meta.key).toContain('fallback title');
      expect(firstRow.__meta.key).not.toBe('instance-0');
    });

    it('adds an occurrence suffix when fallback signatures repeat', () => {
      const result = formatItemSearchInstanceListData([
        {
          id: '',
          titles: [{ type: TitleTypes.Main, value: 'Duplicate Title' }],
          identifiers: [],
          publications: [],
        } as unknown as InstanceAsSearchResultDTO,
        {
          id: '',
          titles: [{ type: TitleTypes.Main, value: 'Duplicate Title' }],
          identifiers: [],
          publications: [],
        } as unknown as InstanceAsSearchResultDTO,
      ]);

      expect(result).toHaveLength(2);
      expect(result[0]?.__meta?.key).not.toBe(result[1]?.__meta?.key);
      expect(result[0]?.__meta?.key).toContain('duplicate title');
      expect(result[1]?.__meta?.key).toContain('duplicate title');
    });
  });

  describe('generateSearchParamsState', () => {
    it('generates state with query only', () => {
      const result = generateSearchParamsState('test query');

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 0,
      });
    });

    it('generates state with query and searchBy', () => {
      const result = generateSearchParamsState('test query', SearchIdentifiers.TITLE);

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 0,
        [SearchQueryParams.SearchBy]: SearchIdentifiers.TITLE,
      });
    });

    it('generates state with query, searchBy, and offset', () => {
      const result = generateSearchParamsState('test query', SearchIdentifiers.LCCN, 20);

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 20,
        [SearchQueryParams.SearchBy]: SearchIdentifiers.LCCN,
      });
    });

    it('generates state with all parameters including segment', () => {
      const result = generateSearchParamsState('test query', SearchIdentifiers.TITLE, 40, 'hubs');

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 40,
        [SearchQueryParams.SearchBy]: SearchIdentifiers.TITLE,
        [SearchQueryParams.Segment]: 'hubs',
      });
    });

    it('generates state with all parameters including source', () => {
      const result = generateSearchParamsState('test query', SearchIdentifiers.TITLE, 0, 'hubs', 'libraryOfCongress');

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 0,
        [SearchQueryParams.SearchBy]: SearchIdentifiers.TITLE,
        [SearchQueryParams.Segment]: 'hubs',
        [SearchQueryParams.Source]: 'libraryOfCongress',
      });
    });

    it('omits searchBy when not provided', () => {
      const result = generateSearchParamsState('test query', null);

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 0,
      });
      expect(result[SearchQueryParams.SearchBy]).toBeUndefined();
    });

    it('omits segment when not provided', () => {
      const result = generateSearchParamsState('test query', SearchIdentifiers.TITLE, 0, null);

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 0,
        [SearchQueryParams.SearchBy]: SearchIdentifiers.TITLE,
      });
      expect(result[SearchQueryParams.Segment]).toBeUndefined();
    });

    it('omits source when not provided', () => {
      const result = generateSearchParamsState('test query', SearchIdentifiers.TITLE, 0, 'hubs', null);

      expect(result).toEqual({
        [SearchQueryParams.Query]: 'test query',
        [SearchQueryParams.Offset]: 0,
        [SearchQueryParams.SearchBy]: SearchIdentifiers.TITLE,
        [SearchQueryParams.Segment]: 'hubs',
      });
      expect(result[SearchQueryParams.Source]).toBeUndefined();
    });

    it('handles null query', () => {
      const result = generateSearchParamsState(null);

      expect(result).toEqual({
        [SearchQueryParams.Query]: null,
        [SearchQueryParams.Offset]: 0,
      });
    });

    it('uses default offset of 0 when not provided', () => {
      const result = generateSearchParamsState('test query', SearchIdentifiers.TITLE);

      expect(result[SearchQueryParams.Offset]).toBe(0);
    });
  });

  describe('removeBackslashes', () => {
    it('removes all backslashes from a string', () => {
      const query = String.raw`hello\world\test`;
      const testResult = 'helloworldtest';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles string with no backslashes', () => {
      const query = 'hello world test';

      expect(removeBackslashes(query)).toBe(query);
    });

    it('handles empty string', () => {
      expect(removeBackslashes('')).toBe('');
    });

    it('handles null query', () => {
      expect(removeBackslashes(null)).toBe('');
    });

    it('handles multiple consecutive backslashes', () => {
      const query = String.raw`hello\\world`;
      const testResult = 'helloworld';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('preserves other special characters', () => {
      const query = String.raw`hello\world!@#$%^&*()`;
      const testResult = 'helloworld!@#$%^&*()';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles escaped quotes', () => {
      const query = String.raw`hello\"world\"`;
      const testResult = 'hello"world"';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles escaped single quotes', () => {
      const query = String.raw`hello\'world\'`;
      const testResult = "hello'world'";

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles escaped forward slashes', () => {
      const query = String.raw`hello\/world\/test`;
      const testResult = 'hello/world/test';

      expect(removeBackslashes(query)).toBe(testResult);
    });

    it('handles multiple escaped quotes in sequence', () => {
      const query = String.raw`\"\"\"hello\"\"\"`;
      const testResult = '"""hello"""';

      expect(removeBackslashes(query)).toBe(testResult);
    });
  });
});
