import baseApi from '@/common/api/base.api';
import { HUB_IMPORT_API_ENDPOINT } from '@/common/constants/api.constants';

import { DEFAULT_HUB_SOURCE, HUB_SOURCE_URI_PATTERNS } from '../constants/hubSources.constants';

export const buildHubUri = (hubId: string, source: string = DEFAULT_HUB_SOURCE): string => {
  const baseUri = HUB_SOURCE_URI_PATTERNS[source];

  if (!baseUri) {
    throw new Error(`Unknown hub source: ${source}`);
  }

  return `${baseUri}/${hubId}.json`;
};

export const getHubByUri = async ({
  hubUri,
  signal,
}: {
  hubUri: string;
  signal?: AbortSignal;
}): Promise<RecordEntry> => {
  const url = baseApi.generateUrl(HUB_IMPORT_API_ENDPOINT);

  return baseApi.getJson({
    url,
    urlParams: {
      hubUri,
    },
    requestParams: {
      method: 'GET',
      signal,
    },
  });
};

export const getHubById = async ({
  hubId,
  source = DEFAULT_HUB_SOURCE,
  signal,
}: {
  hubId: string;
  source?: string;
  signal?: AbortSignal;
}): Promise<RecordEntry> => {
  const hubUri = buildHubUri(hubId, source);

  return getHubByUri({ hubUri, signal });
};
