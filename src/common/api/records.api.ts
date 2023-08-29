import { BIBFRAME_API_ENDPOINT, MAX_LIMIT } from '@common/constants/api.constants';
import baseApi from './base.api';

type SingleRecord = {
  recordId: string;
};

type GetAllRecords = {
  pageSize?: number;
  pageNumber?: number;
};

const singleRecordUrl = `${BIBFRAME_API_ENDPOINT}/:recordId`;

export const getRecord = async ({ recordId }: SingleRecord) => {
  const url = baseApi.generateUrl(singleRecordUrl, { name: ':recordId', value: recordId });

  return baseApi.getJson({
    url,
  });
};

export const getAllRecords = async ({ pageSize = MAX_LIMIT, pageNumber = MAX_LIMIT }: GetAllRecords) => {
  return baseApi.getJson({
    url: BIBFRAME_API_ENDPOINT,
    urlParams: {
      pageSize: String(pageSize),
      pageNumber: String(pageNumber),
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
        'content-type': 'application/json',
      },
    },
  });
};
