import { IMPORT_JSON_FILE_API_ENDPOINT } from '@common/constants/api.constants';
import { LD_JSON_MIME_TYPE } from '@common/constants/import.constants';
import baseApi from './base.api';

export const importFile = async (files: File[]) => {
  const formData = new FormData();

  // Only uploading one file at the moment
  if (files.length > 0) {
    const buf = await files[0].arrayBuffer();
    const blob = new Blob([new Uint8Array(buf)], { type: LD_JSON_MIME_TYPE });
    formData.append('fileName', blob);
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
