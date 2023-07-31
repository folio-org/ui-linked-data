import baseApi from './base.api';

const getByIdentifierUrl = '/search/bibframe';
export const getByIdentifier = async (id: string, query: string) => {
  return await baseApi.getJson({ url: getByIdentifierUrl, urlParams: { query: `${id}=${query}` } });
};
