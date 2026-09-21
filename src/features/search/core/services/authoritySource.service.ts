import baseApi from '@/common/api/base.api';
import { MAX_LIMIT, SOURCE_API_ENDPOINT, SOURCE_API_RESPONSE_KEY } from '@/common/constants/api.constants';

interface AuthoritySourceFilesResponse {
  [key: string]: Array<{ id?: string; name?: string }> | undefined;
}

let cachedSourcesPromise: Promise<Map<string, string>> | undefined;

async function fetchSourceMap(): Promise<Map<string, string>> {
  const response = (await baseApi.getJson({
    url: SOURCE_API_ENDPOINT.AUTHORITY,
    urlParams: { limit: String(MAX_LIMIT) },
    sameOrigin: true,
  })) as AuthoritySourceFilesResponse;

  const sources = response?.[SOURCE_API_RESPONSE_KEY.AUTHORITY] ?? [];

  return new Map(sources.filter(source => source.id).map(source => [source.id as string, source.name ?? '']));
}

/**
 * Service that resolves authority source-file ids to human-readable names.
 * The result is cached for the session since source files are effectively static;
 * a failed request clears the cache so the next call can retry.
 */
export const authoritySourceService = {
  getSourceMap(): Promise<Map<string, string>> {
    cachedSourcesPromise ??= fetchSourceMap().catch(error => {
      cachedSourcesPromise = undefined;
      throw error;
    });

    return cachedSourcesPromise;
  },
};
