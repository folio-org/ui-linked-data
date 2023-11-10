// TODO: caching, abort controllers

import { EDITOR_API_BASE_PATH, OKAPI_CONFIG } from '@common/constants/api.constants';
import { getEnvVariable } from '@common/helpers/env.helper';
import { localStorageService } from '@common/services/storage';

type ReqParams = {
  url: string;
  urlParams?: Record<string, string>;
  requestParams?: RequestInit;
};

async function doRequest(url: string, requestParams: RequestInit) {
  const {
    basePath = getEnvVariable(EDITOR_API_BASE_PATH),
    tenant,
    token,
  } = localStorageService.deserialize(OKAPI_CONFIG) || {};
  
  const okapiHeaders = tenant
    ? {
        'x-okapi-tenant': tenant,
        'x-okapi-token': token,
      }
    : undefined;

  try {
    const response = await fetch(`${basePath}${url}`, {
      ...requestParams,
      headers: {
        ...okapiHeaders,
        ...requestParams.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw errorBody;
    }

    return response;
  } catch (err) {
    console.error(err);

    throw err;
  }
}

const request = async ({ url, urlParams, requestParams = {} }: ReqParams) => {
  const withUrlParams = urlParams ? `?${new URLSearchParams(urlParams)}` : '';
  const response = await doRequest(`${url}${withUrlParams}`, {
    ...requestParams,
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
