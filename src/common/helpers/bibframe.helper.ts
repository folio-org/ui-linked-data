import { BF2_TO_BFLITE_MAP } from '@common/constants/bibframeMapping.constants';

export const getMappedBFLiteUri = (uri: string | undefined, schema?: Schema, path?: string[]) => {
  if (!uri || !BF2_TO_BFLITE_MAP[uri]) return undefined;

  const mappedUri = BF2_TO_BFLITE_MAP[uri];
  const uriType = typeof mappedUri;

  if (uriType === 'string') {
    return BF2_TO_BFLITE_MAP[uri] as string;
  } else if (uriType === 'object') {
    let updatedUri = undefined;

    path?.forEach(elem => {
      const schemaElem = schema?.get(elem);

      if (!schemaElem || !schemaElem.uri) return;

      const mappedUriTypped = mappedUri as BFMapEntry;
      const schemaElemUri = schemaElem.uri as string;
      const pathUri = mappedUriTypped?.[schemaElemUri];

      if (pathUri) {
        updatedUri = pathUri;
      }
    });

    return updatedUri;
  }
};
