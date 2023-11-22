import { SEARCH_RESULTS_LIMIT } from '@common/constants/search.constants';
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
export const getByIdentifier = async (
  id: string,
  query: string,
  offset: string = '0',
  limit: string = SEARCH_RESULTS_LIMIT.toString(),
) => {
  const urlParams: Record<string, string> | undefined = { query: `(${id} all "${query}") sortby title`, offset, limit };

  return await baseApi.getJson({ url: getByIdentifierUrl, urlParams });
};
