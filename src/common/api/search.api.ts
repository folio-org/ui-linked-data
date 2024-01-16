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

export type GetByIdentifier = {
  searchBy?: string;
  query: string;
  offset?: string;
  limit?: string;
};

const getByIdentifierUrl = '/search/bibframe';
export const getByIdentifier = async ({
  searchBy,
  query,
  offset = '0',
  limit = SEARCH_RESULTS_LIMIT.toString(),
}: GetByIdentifier) => {
  const urlParams: Record<string, string> | undefined = {
    query: searchBy ? `(${searchBy} all "${query}") sortby title` : `${query} sortby title`,
    offset,
    limit,
  };

  return await baseApi.getJson({ url: getByIdentifierUrl, urlParams });
};
