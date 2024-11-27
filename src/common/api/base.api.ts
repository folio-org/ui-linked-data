// TODO: UILD-60 - caching, abort controllers

import { EDITOR_API_BASE_PATH, OKAPI_CONFIG } from '@common/constants/api.constants';
import { getEnvVariable } from '@common/helpers/env.helper';
import { localStorageService } from '@common/services/storage';

type ReqParams = {
  url: string;
  urlParams?: Record<string, string>;
  requestParams?: RequestInit;
  sameOrigin?: boolean;
};

type Headers = {
  'x-okapi-tenant': string;
  'x-okapi-token'?: string;
};

type DoRequest = {
  url: string;
  requestParams: RequestInit;
  headers?: Headers;
};

async function doRequest({ url, requestParams, headers }: DoRequest) {
  try {
    const response = await fetch(url, {
      ...requestParams,
      headers: {
        ...headers,
        ...requestParams.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw errorBody;
    }

    return response;
  } catch (err: any) {
    const selectedError = err?.errors?.[0];
    
    selectedError && console.error(`${selectedError?.type}: ${selectedError?.message}`);

    throw err;
  }
}

const request = async ({ url, urlParams, requestParams = {}, sameOrigin = true }: ReqParams) => {
  const {
    basePath = getEnvVariable(EDITOR_API_BASE_PATH),
    tenant,
    token,
  } = localStorageService.deserialize(OKAPI_CONFIG) || {};

  const okapiHeaders =
    tenant && sameOrigin
      ? {
          'x-okapi-tenant': tenant,
          ...(token && { 'x-okapi-token': token })
        }
      : undefined;

  const withUrlParams = urlParams ? `?${new URLSearchParams(urlParams)}` : '';
  const response = await doRequest({
    url: `${sameOrigin ? basePath : ''}${url}${withUrlParams}`,
    requestParams,
    headers: okapiHeaders,
  });

  return response;
};

const getJson = async ({
  url,
  urlParams,
  requestParams = {
    method: 'GET',
  },
}: ReqParams) => {
  const response = await request({ url, urlParams, requestParams });

  if (response?.ok) {
    const formatted = await response.json();
    return formatted;
  }

  return response;
};

type URLParam = { name: string; value: string | number };

const generateUrl = (url: string, param?: URLParam) => {
  if (!param) return url;

  return url.replace(param.name, param.value.toString());
};

export default {
  request,
  getJson,
  generateUrl,
};
