import { DUPLICATE_URI_REPLACEMENTS } from '@common/constants/bibframe.constants';
import { BF2_TO_BFLITE_MAP } from '@common/constants/bibframeMapping.constants';
import { RecordEditActions } from '@common/constants/record.constants';
import { QueryParams, ROUTES } from '@common/constants/routes.constants';

export const getMappedBFLiteUri = (uri: string | undefined, schema?: Schema, path?: string[]) => {
  if (!uri || !BF2_TO_BFLITE_MAP[uri]) return undefined;

  const mappedUri = BF2_TO_BFLITE_MAP[uri];
  const uriType = typeof mappedUri;

  if (uriType === 'string') {
    return BF2_TO_BFLITE_MAP[uri] as string;
  } else if (uriType === 'object') {
    let updatedUri;

    path?.forEach(elem => {
      const schemaElem = schema?.get(elem);

      if (!schemaElem || !schemaElem.uri) return;

      const mappedUriTyped = mappedUri as BFMapEntry;
      const schemaElemUri = schemaElem.uri as string;
      const pathUri = mappedUriTyped?.[schemaElemUri];

      if (pathUri) {
        updatedUri = pathUri;
      }
    });

    return updatedUri;
  }
};

type GetUris = {
  uri: string;
  dataTypeURI?: string;
  schema?: Schema;
  path?: string[];
};

export const getUris = ({ uri, dataTypeURI, schema, path }: GetUris) => {
  if (Object.keys(DUPLICATE_URI_REPLACEMENTS).includes(uri) && dataTypeURI) {
    const replacedUri = DUPLICATE_URI_REPLACEMENTS[uri][dataTypeURI];

    return {
      uriBFLite: replacedUri,
      uriWithSelector: replacedUri,
    };
  }

  const uriBFLite = getMappedBFLiteUri(uri, schema, path);
  const uriWithSelector = uriBFLite || uri;

  return { uriBFLite, uriWithSelector };
};

export const getEditActionPrefix = (route?: string, search?: URLSearchParams) => {
  if (route === ROUTES.RESOURCE_CREATE.uri) {
    return search?.get(QueryParams.CloneOf) ? RecordEditActions.Duplicate : RecordEditActions.New;
  } else {
    return RecordEditActions.Edit;
  }
};
