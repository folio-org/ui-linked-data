import { getLookupDict } from '@/common/api/lookup.api';
import { ApiErrorCodes } from '@/common/constants/api.constants';

export const loadSimpleLookup = async (
  uris: string | string[],
): Promise<LoadSimpleLookupResponseItem[] | undefined> => {
  if (!Array.isArray(uris)) {
    uris = [uris];
  }

  for await (const uri of uris) {
    const formattedUri = !uri.includes('.json') ? `${uri}.json` : uri;
    const data = await fetchSimpleLookup(formattedUri);

    return data;
  }
};

const fetchSimpleLookup = async (url: string): Promise<any> => {
  if (url.includes('id.loc.gov')) {
    url = url.replace('http://', 'https://');
  }

  // if we use the memberOf there might be a id URL in the params, make sure its not https
  url = url.replace('memberOf=https://id.loc.gov/', 'memberOf=http://id.loc.gov/');

  const response = await getLookupDict(url, url.includes('.rdf') || url.includes('.xml'));

  return response;
};

export const checkHasErrorOfCodeType = (err: ApiError, codeType: ApiErrorCodes) =>
  err?.errors.find(e => e.code === codeType);

export const getFriendlyErrorMessage = (err: unknown) => {
  const apiError = err as Partial<{ errors: { code: string }[] }>;

  if (!apiError.errors?.length) return 'ld.cantSaveRd';
  const errorCode = apiError.errors[0].code as keyof typeof ApiErrorCodes;

  return `ld.${ApiErrorCodes[errorCode] ?? errorCode}`;
};
