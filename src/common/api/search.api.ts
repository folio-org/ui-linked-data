import baseApi from './base.api';

export type ItemSearchResponse = Partial<{
  search_query: string;
  content: Partial<{
    id: string;
    title: string;
    authors: {
      name?: string;
    }[];
    dateOfPublication: string;
    editionStatement: string;
  }>[];
}>;

const getByIdentifierUrl = '/search/bibframe';
export const getByIdentifier = async (id: string, query: string) => {
  return await baseApi.getJson({ url: getByIdentifierUrl, urlParams: { query: `${id}=${query}` } });
};
