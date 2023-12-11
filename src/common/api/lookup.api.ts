import baseApi from './base.api';

export const getLookupDict = async (url: string, isText = false) => {
  const response = await baseApi.request({
    url,
    sameOrigin: false,
  });
  const formatted = await (isText ? response.text() : response.json());

  return formatted;
};
