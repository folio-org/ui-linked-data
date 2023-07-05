// TODO: caching, abort controllers

import { OKAPI_PREFIX } from '../constants/api.constants';

const BASE_PATH = localStorage.getItem(`${OKAPI_PREFIX}_url`) || import.meta.env.EDITOR_API_BASE_PATH;

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
  urlParams?: Record<string, unknown>;
  requestParams?: RequestInit;
};

const request = async ({ url, requestParams = {} }: ReqParams) => {
  const response = await doRequest(url, { ...requestParams });

  return response;
};

const getJson = async ({
  url,
  urlParams = {},
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

export default {
  request,
  getJson,
};
