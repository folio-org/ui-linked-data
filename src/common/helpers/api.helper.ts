import { getLookupDict } from '@common/api/lookup.api';

export const loadSimpleLookup = async (
  uris: string | string[],
): Promise<LoadSimpleLookupResponseItem[] | undefined> => {
  // TODO make this better for multuple lookup list (might not be needed)
  if (!Array.isArray(uris)) {
    uris = [uris];
  }

  for (const uri of uris) {
    // TODO more checks here
    const formattedUri = !uri.includes('.json') ? `${uri}.json` : uri;
    const data = await fetchSimpleLookup(formattedUri);

    return data;
  }
};

// TODO: It's return different response depending on the uri. How to type this?
const fetchSimpleLookup = async (url: string): Promise<any> => {
  if (url.includes('id.loc.gov')) {
    url = url.replace('http://', 'https://');
  }

  // if we use the memberOf there might be a id URL in the params, make sure its not https
  url = url.replace('memberOf=https://id.loc.gov/', 'memberOf=http://id.loc.gov/');

  const response = await getLookupDict(url, url.includes('.rdf') || url.includes('.xml'));

  return response;
};
