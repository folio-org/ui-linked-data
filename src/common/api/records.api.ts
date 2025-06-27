import {
  BIBFRAME_API_ENDPOINT,
  ExternalResourceIdType,
  GET_RESOURCE_BY_TYPE_URIS,
  INVENTORY_API_ENDPOINT,
  MAX_LIMIT,
} from '@common/constants/api.constants';
import baseApi from './base.api';
import { TYPE_URIS } from '@common/constants/bibframe.constants';

type SingleRecord = {
  recordId: string;
};

type IGetRecord = SingleRecord & {
  idType?: ExternalResourceIdType;
};

type GetAllRecords = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};

const singleRecordUrl = `${BIBFRAME_API_ENDPOINT}/:recordId`;

export const getRecord = async ({ recordId, idType }: IGetRecord) => {
  const selectedUrl = (idType && GET_RESOURCE_BY_TYPE_URIS[idType]) ?? singleRecordUrl;
  const url = baseApi.generateUrl(selectedUrl, { name: ':recordId', value: recordId });

  return baseApi.getJson({
    url,
  });
};

const graphIdByInventoryIdUrl = `${INVENTORY_API_ENDPOINT}/:recordId/import`;

export const getGraphIdByExternalId = async ({ recordId }: IGetRecord) => {
  const url = baseApi.generateUrl(graphIdByInventoryIdUrl, { name: ':recordId', value: recordId });

  const response = await baseApi.request({
    url,
    requestParams: {
      method: 'POST',
    },
  });

  return await response?.json();
};

const singleRecordMarcUrl = `${BIBFRAME_API_ENDPOINT}/:recordId/marc`;

export const getMarcRecord = async ({ recordId, endpointUrl }: SingleRecord & { endpointUrl?: string }) => {
  const url = baseApi.generateUrl(endpointUrl ?? singleRecordMarcUrl, {
    name: ':recordId',
    value: recordId,
  });

  return baseApi.getJson({
    url,
  });
};

const instanceRdfUrl = `${BIBFRAME_API_ENDPOINT}/:recordId/rdf`;

export const getRdfRecordLink = ( recordId: string ) => {
  const url = baseApi.generateUrl(instanceRdfUrl, {
    name: ':recordId',
    value: recordId,
  });

  return url;
};

export const getAllRecords = async ({
  pageSize = MAX_LIMIT,
  pageNumber = MAX_LIMIT,
  type = TYPE_URIS.INSTANCE,
}: GetAllRecords) => {
  return baseApi.getJson({
    url: BIBFRAME_API_ENDPOINT,
    urlParams: {
      pageSize: String(pageSize),
      pageNumber: String(pageNumber),
      type,
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
