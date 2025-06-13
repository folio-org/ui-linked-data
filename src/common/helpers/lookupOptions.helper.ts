import { BFLITE_TYPES_MAP } from '@common/constants/bibframeMapping.constants';
import {
  AUTHORITATIVE_LABEL_URI,
  BLANK_NODE_TRAIT,
  CODE_SEPARATOR,
  ID_KEY,
  SCHEMA_LABEL_URI,
  VALUE_KEY,
} from '@common/constants/lookup.constants';

export const generateLabelWithCode = (label: string, optionUri: string) => {
  const processedOptionUri = optionUri.split(CODE_SEPARATOR);
  const code = processedOptionUri.length > 1 ? processedOptionUri.pop() : undefined;
  const codeString = code ? ` (${code})` : '';

  return `${label}${codeString}`;
};

export const formatLookupOptions = (
  data: LoadSimpleLookupResponseItem[] = [],
  parentURI?: string,
): MultiselectOption[] =>
  data
    .filter(dataItem => {
      const id = dataItem[ID_KEY];
      return id !== parentURI && !id?.includes(BLANK_NODE_TRAIT);
    })
    .map<MultiselectOption>(option => {
      const optionUri = option[ID_KEY];
      const optionLabelElem = option[AUTHORITATIVE_LABEL_URI] ?? option[SCHEMA_LABEL_URI];
      const label = optionLabelElem?.[0]?.[VALUE_KEY] ?? '';
      const formattedLabel = generateLabelWithCode(label, optionUri);

      return {
        value: {
          label, // used as a basic unformatted label in Preview and similar components
          uri: optionUri,
        },
        label: formattedLabel, // used for displaying a label with a code in Simple Lookups
        __isNew__: false,
      };
    });

export const getBFGroup = (typeMap: FieldTypeMap, propertyURI: string, parentGroupUri?: string) => {
  return (
    Object.values(typeMap).find(({ field }) => (field as { uri: string }).uri === propertyURI) ??
    (parentGroupUri ? typeMap[parentGroupUri]?.fields?.[propertyURI] : undefined)
  );
};

export const filterLookupOptionsByMappedValue = (
  lookupData: MultiselectOption[],
  propertyURI?: string,
  parentGroupUri?: string,
) => {
  if (!propertyURI) return lookupData;

  let filteredLookupData = lookupData;
  const typesMap = BFLITE_TYPES_MAP;
  const bfGroup = getBFGroup(typesMap as FieldTypeMap, propertyURI, parentGroupUri);

  if (bfGroup) {
    const bf20Uris = Object.values(bfGroup.data).map(({ uri }) => uri);

    filteredLookupData = lookupData.filter(({ value }) => bf20Uris.includes(value.uri));
  }

  return filteredLookupData;
};

export const filterLookupOptionsByParentBlock = (
  lookupData?: MultiselectOption[] | Nullish,
  propertyURI?: string,
  parentBlockUri?: string,
  parentGroupUri?: string,
) => {
  if (!lookupData) return;

  if (!parentBlockUri || !propertyURI) return lookupData;

  let filteredLookupData = lookupData;
  const typesMap = BFLITE_TYPES_MAP;
  const bfGroup = getBFGroup(typesMap as FieldTypeMap, propertyURI, parentGroupUri);

  if (bfGroup) {
    const bf20MappedData = Object.values(bfGroup.data);

    filteredLookupData = lookupData.filter(({ value }) =>
      bf20MappedData.find((data: FieldTypeMapDataValue) => {
        const definedParentBlock = data.parentBlock;
        const hasTheSameUri = data.uri === value.uri;

        return definedParentBlock ? definedParentBlock.bfLiteUri === parentBlockUri && hasTheSameUri : hasTheSameUri;
      }),
    );
  }

  return filteredLookupData;
};
