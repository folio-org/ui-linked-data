import baseApi from '@/common/api/base.api';
import { HUB_IMPORT_API_ENDPOINT } from '@/common/constants/api.constants';

export const normalizeExternalHubUri = (uri: string): string => {
  const httpsUri = uri.replace(/^http:\/\//, 'https://');

  return `${httpsUri}.json`;
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

export const importHub = async ({ hubUri, signal }: { hubUri: string; signal?: AbortSignal }): Promise<RecordEntry> => {
  const url = baseApi.generateUrl(HUB_IMPORT_API_ENDPOINT);

  return baseApi.getJson({
    url,
    urlParams: {
      hubUri,
    },
    requestParams: {
      method: 'POST',
      signal,
    },
  });
};
