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
