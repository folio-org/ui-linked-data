import { BIBFRAME_API_ENDPOINT, MAX_LIMIT, OKAPI_PREFIX } from '@common/constants/api.constants';
import baseApi from './base.api';

type SingleRecord = {
  recordId: string;
};

type GetAllRecords = {
  pageSize?: number;
  pageNumber?: number;
};

// this OR use recoil: arg -> state -> apply state -> call fetch -> set state
const tenant = localStorage.getItem(`${OKAPI_PREFIX}_tenant`) || '';
const token = localStorage.getItem(`${OKAPI_PREFIX}_token`) || '';

const headers = tenant
  ? {
      'x-okapi-tenant': tenant,
      'x-okapi-token': token,
    }
  : undefined;

const singleRecordUrl = `${BIBFRAME_API_ENDPOINT}/:recordId`;

export const getRecord = async ({ recordId }: SingleRecord) => {
  const url = baseApi.generateUrl(singleRecordUrl, { name: ':recordId', value: recordId });

  return baseApi.getJson({
    url,
    requestParams: {
      headers,
    },
  });
};

export const getAllRecords = async ({ pageSize = MAX_LIMIT, pageNumber = MAX_LIMIT }: GetAllRecords) => {
  const stringParams = new URLSearchParams({
    pageSize: String(pageSize),
    pageNumber: String(pageNumber),
  }).toString();

  return baseApi.getJson({
    url: `${BIBFRAME_API_ENDPOINT}?${stringParams}`,
    requestParams: {
      headers,
    },
  });
};

export const postRecord = async (recordEntry: RecordEntry) => {
  const url = baseApi.generateUrl(BIBFRAME_API_ENDPOINT);

  return baseApi.request({
    url,
    requestParams: {
      method: 'POST',
      body: JSON.stringify(recordEntry),
      headers: {
        ...headers,
        'content-type': 'application/json',
      },
    },
  });
};

export const putRecord = async (recordId: string | number, recordEntry: RecordEntry) => {
  const url = baseApi.generateUrl(singleRecordUrl, { name: ':recordId', value: recordId });

  return baseApi.request({
    url,
    requestParams: {
      method: 'PUT',
      body: JSON.stringify(recordEntry),
      headers: {
        ...headers,
        'content-type': 'application/json',
      },
    },
  });
};

export const deleteRecord = async (recordId: string | number) => {
  const url = baseApi.generateUrl(singleRecordUrl, { name: ':recordId', value: recordId });

  return baseApi.request({
    url,
    requestParams: {
      method: 'DELETE',
      headers: {
        ...headers,
        'content-type': 'application/json',
      },
    },
  });
};
