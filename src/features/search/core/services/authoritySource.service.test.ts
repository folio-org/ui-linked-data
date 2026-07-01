import { SOURCE_API_ENDPOINT } from '@/common/constants/api.constants';

jest.mock('@/common/api/base.api');

// Re-import the service inside an isolated module scope on each test so that
// the module-level `cachedSourcesPromise` is reset to `undefined`.
type AuthoritySourceService = (typeof import('./authoritySource.service'))['authoritySourceService'];

let authoritySourceService: AuthoritySourceService;
let mockGetJson: jest.Mock;

beforeEach(async () => {
  await jest.isolateModulesAsync(async () => {
    const { authoritySourceService: importedAuthoritySourceService } = await import('./authoritySource.service');
    const { default: baseApi } = await import('@/common/api/base.api');

    authoritySourceService = importedAuthoritySourceService;
    mockGetJson = baseApi.getJson as jest.Mock;
    mockGetJson.mockReset();
  });
});

describe('authoritySourceService', () => {
  describe('getSourceMap', () => {
    it('returns a map of id → name from the API response', async () => {
      mockGetJson.mockResolvedValue({
        authoritySourceFiles: [
          { id: 'src-1', name: 'LC Name Authority File' },
          { id: 'src-2', name: 'MeSH' },
        ],
      });

      const result = await authoritySourceService.getSourceMap();

      expect(result).toEqual(
        new Map([
          ['src-1', 'LC Name Authority File'],
          ['src-2', 'MeSH'],
        ]),
      );
      expect(mockGetJson).toHaveBeenCalledWith(
        expect.objectContaining({ url: SOURCE_API_ENDPOINT.AUTHORITY, sameOrigin: true }),
      );
    });

    it('returns an empty map when the response has no sources', async () => {
      mockGetJson.mockResolvedValue({ authoritySourceFiles: [] });

      const result = await authoritySourceService.getSourceMap();

      expect(result).toEqual(new Map());
    });

    it('filters out entries without an id', async () => {
      mockGetJson.mockResolvedValue({
        authoritySourceFiles: [
          { id: 'src-1', name: 'Valid Source' },
          { name: 'No Id Source' },
          { id: '', name: 'Empty Id Source' },
        ],
      });

      const result = await authoritySourceService.getSourceMap();

      expect(result).toEqual(new Map([['src-1', 'Valid Source']]));
    });

    it('uses empty string for name when name is absent', async () => {
      mockGetJson.mockResolvedValue({ authoritySourceFiles: [{ id: 'src-1' }] });

      const result = await authoritySourceService.getSourceMap();

      expect(result.get('src-1')).toBe('');
    });

    it('handles a null/undefined response gracefully', async () => {
      mockGetJson.mockResolvedValue(null);

      const result = await authoritySourceService.getSourceMap();

      expect(result).toEqual(new Map());
    });

    it('caches the result and only calls the API once for repeated calls', async () => {
      mockGetJson.mockResolvedValue({ authoritySourceFiles: [{ id: 'src-1', name: 'Source 1' }] });

      await authoritySourceService.getSourceMap();
      await authoritySourceService.getSourceMap();

      expect(mockGetJson).toHaveBeenCalledTimes(1);
    });

    it('clears the cache and retries after a failed request', async () => {
      mockGetJson
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValue({ authoritySourceFiles: [{ id: 'src-1', name: 'Source 1' }] });

      await expect(authoritySourceService.getSourceMap()).rejects.toThrow('network error');

      const result = await authoritySourceService.getSourceMap();

      expect(mockGetJson).toHaveBeenCalledTimes(2);
      expect(result.get('src-1')).toBe('Source 1');
    });
  });
});
