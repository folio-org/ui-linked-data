import { IMPORT_JSON_FILE_API_ENDPOINT } from '@common/constants/api.constants';
import baseApi from './base.api';

export const importFile = async (files: File[]) => {
  const formData = new FormData();

  // Only uploading one file at the moment
  if (files.length > 0) {
    formData.append('fileName', files[0]);
  }

  const url = baseApi.generateUrl(IMPORT_JSON_FILE_API_ENDPOINT);

  return baseApi.request({
    url,
    requestParams: {
      method: 'POST',
      body: formData,
    },
  });
};
