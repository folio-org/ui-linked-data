import { IMPORT_JSON_FILE_API_ENDPOINT, IMPORT_JSON_URL_API_ENDPOINT } from '@/common/constants/api.constants';

import baseApi from './base.api';

export const importFile = async (files: File[], filterType: string): Promise<ImportResponseDTO> => {
  const formData = new FormData();

  // Only uploading one file at the moment
  if (files.length > 0) {
    formData.append('fileName', files[0]);
  }

  const url = baseApi.generateUrl(IMPORT_JSON_FILE_API_ENDPOINT);

  return await baseApi.getJson({
    url,
    urlParams: {
      filterType,
    },
    requestParams: {
      method: 'POST',
      body: formData,
    },
  });
};

export const importUrl = async (
  url: string,
  filterType: string,
  defaultWorkType: string,
): Promise<ImportResponseDTO> => {
  const apiUrl = baseApi.generateUrl(IMPORT_JSON_URL_API_ENDPOINT);

  return baseApi.getJson({
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
};
