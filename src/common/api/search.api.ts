import baseApi from './base.api';

export type ItemSearchResponse = {
  searchQuery: string;
  content: {
    id: string;
    titles?: {
      value?: string;
      type?: string;
    }[];
    identifiers?: {
      value?: string;
      type?: string;
    }[];
    contributors?: {
      name?: string;
      primary?: boolean;
    }[];
    publications?: {
      publisher?: string;
      dateOfPublication?: string;
    }[];
    editionStatement?: string;
  }[];
};

const getByIdentifierUrl = '/search/bibframe';
export const getByIdentifier = async (id: string, query: string) => {
  return await baseApi.getJson({ url: getByIdentifierUrl, urlParams: { query: `${id}=${query}` } });
};
