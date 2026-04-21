import { getLookupDict } from '@/common/api/lookup.api';
import { ApiErrorCodes } from '@/common/constants/api.constants';

const hasLinkedDataSuffix = (pathname: string) => {
  return pathname.endsWith('.json') || hasTextTypeSuffix(pathname);
};

const hasTextTypeSuffix = (pathname: string) => {
  return pathname.endsWith('.rdf') || pathname.endsWith('.xml');
};

export const loadSimpleLookup = async (
  uris: string | string[],
): Promise<LoadSimpleLookupResponseItem[] | undefined> => {
  if (!Array.isArray(uris)) {
    uris = [uris];
  }

  for await (const uri of uris) {
    let formattedUri = uri;
    const parsed = URL.parse(uri);
    if (parsed) {
      if (!hasLinkedDataSuffix(parsed.pathname)) {
        parsed.pathname = `${parsed.pathname}.json`;
      }
      if (parsed.hostname.endsWith('id.loc.gov')) {
        parsed.protocol = 'https';
      }
      formattedUri = parsed.href;
    }

    const data = await fetchSimpleLookup(formattedUri);

    return data;
  }
};

const fetchSimpleLookup = async (url: string): Promise<any> => {
  let sameOrigin = true;
  let isText = false;

  const parsed = URL.parse(url);
  if (parsed) {
    sameOrigin = false;
    if (hasTextTypeSuffix(parsed.pathname)) {
      isText = true;
    }
  } else {
    // Parse likely local-relative URL path with a placeholder host to check suffix
    const localhostParsed = URL.parse(url, 'http://localhost/');
    if (localhostParsed && hasTextTypeSuffix(localhostParsed.pathname)) {
      isText = true;
    }
  }

  const response = await getLookupDict(url, isText, sameOrigin);

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
