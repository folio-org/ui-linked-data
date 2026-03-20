import { IMPORT_JSON_FILE_API_ENDPOINT, IMPORT_JSON_URL_API_ENDPOINT } from '@/common/constants/api.constants';

import baseApi from './base.api';

export const importFile = async (files: File[], filterType: string) => {
  const formData = new FormData();

  // Only uploading one file at the moment
  if (files.length > 0) {
    formData.append('fileName', files[0]);
  }

  const url = baseApi.generateUrl(IMPORT_JSON_FILE_API_ENDPOINT);

  const response = await baseApi.request({
    url,
    urlParams: {
      filterType,
    },
    requestParams: {
      method: 'POST',
      body: formData,
    },
  });

  return (await response?.json()) as Promise<ImportResponseDTO>;
};

export const importUrl = async (url: string, filterType: string, defaultWorkType: string) => {
  const apiUrl = baseApi.generateUrl(IMPORT_JSON_URL_API_ENDPOINT);

  const response = await baseApi.request({
    url: apiUrl,
    urlParams: {
      url,
      filterType,
      defaultWorkType,
    },
    requestParams: {
      method: 'POST',
    },
  });

  return (await response?.json()) as Promise<ImportResponseDTO>;
};
