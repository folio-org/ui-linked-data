// TODO: add generated API types if possible
interface LoadSimpleLookupResponseItem {
  '@id': string;
  '@type': string[];
  [key: string]: Array<{
    '@id'?: string;
    '@value'?: string;
    '@language'?: string;
    '@type'?: string;
  }>;
}

type ResourceListItem = {
  id: string;
  label: string;
  type?: string;
};

type ApiError = {
  errors: {
    code?: string;
  }[];
};

type GenericStructDTO<T> = {
  value?: string;
  type?: T;
};

type ContributorType = 'Family' | 'Jurisdiction' | 'Meeting' | 'Organization' | 'Person';

type ContributorDTO = {
  name?: string;
  type?: ContributorType;
  isCreator?: boolean;
};

type TitleType = 'Main' | 'Sub';

type InstanceAsSearchResultDTO = {
  id: string;
  titles?: GenericStructDTO<TitleType>[];
  identifiers?: GenericStructDTO<'Ean' | 'ISBN' | 'LCCN' | 'LocalId' | 'UNKNOWN'>[];
  publications?: { name?: string; date?: string }[];
  editionStatements?: string[];
};

type WorkAsSearchResultDTO = {
  id: string;
  titles?: GenericStructDTO<TitleType>[];
  contributors?: ContributorDTO[];
  languages?: string[];
  subjects?: string[];
  classifications?: { number?: string; type?: string }[];
  instances?: InstanceAsSearchResultDTO[];
};

type AuthorityAsSearchResultDTO = {
  id: string;
  authRefType?: string;
  headingRef?: string;
  headingType?: string;
  sourceFileId?: string;
  [key: string]: string | string[];
};

type AuthorityAsBrowseResultDTO = {
  headingRef?: string;
  authority?: AuthorityAsSearchResultDTO[];
  isAnchor?: boolean;
};

interface IApiClient {
  loadSimpleLookupData: (uris: string | string[]) => Promise<LoadSimpleLookupResponseItem[] | undefined>;
}

type Metadata = {
  createdDate: string;
  createdByUserId: string;
  updatedDate: string;
  updatedByUserId: string;
};

type MarcDTOParsedRecordContentSubfield = {
  subfields: Record<string, string>[];
  isHighlighted?: boolean;
  ind1?: string;
  ind2?: string;
};

type MarcDTOParsedRecordContentField = Record<string, string | MarcDTOParsedRecordContentSubfield>;

type MarcDTO = {
  id: string;
  recordType: string;
  matchedId: string;
  parsedRecord: {
    content: {
      leader?: string;
      fields: Record<string, string | any>[];
    };
    id: string;
  };
  metadata: Metadata;
};

type APIRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
