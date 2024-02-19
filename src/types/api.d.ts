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
};

type WorkAsSearchResultDTO = {
  id: string;
  titles?: GenericStructDTO<TitleType>[];
  contributors?: ContributorDTO[];
  languages?: { value?: string }[];
  classifications?: { number?: string; source?: string }[];
  instances?: InstanceAsSearchResultDTO[];
};
