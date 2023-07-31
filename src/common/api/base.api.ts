// TODO: caching, abort controllers

import { EDITOR_API_BASE_PATH, OKAPI_PREFIX } from '@common/constants/api.constants';
import { getEnvVariable } from '@common/helpers/env.helper';

const BASE_PATH = localStorage.getItem(`${OKAPI_PREFIX}_url`) || getEnvVariable(EDITOR_API_BASE_PATH);

async function doRequest(url: string, requestParams: RequestInit) {
  try {
    const response = await fetch(`${BASE_PATH}${url}`, requestParams);

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

type ReqParams = {
  url: string;
  urlParams?: Record<string, string>;
  requestParams?: RequestInit;
};

const request = async ({ url, urlParams, requestParams = {} }: ReqParams) => {
  const withUrlParams = urlParams ? `?${new URLSearchParams(urlParams)}` : '';
  const response = await doRequest(`${url}${decodeURIComponent(withUrlParams)}`, { ...requestParams });

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
