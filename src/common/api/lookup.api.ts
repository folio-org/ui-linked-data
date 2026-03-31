import baseApi from './base.api';

export const getLookupDict = async (url: string, isText = false, sameOrigin = false) => {
  const response = await baseApi.request({
    url,
    sameOrigin,
  });
  const formatted = await (isText ? response.text() : response.json());

  return formatted;
};
