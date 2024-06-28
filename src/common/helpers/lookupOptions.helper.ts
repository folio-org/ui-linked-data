import { BFLITE_TYPES_MAP } from '@common/constants/bibframeMapping.constants';
import {
  AUTHORITATIVE_LABEL_URI,
  BLANK_NODE_TRAIT,
  CODE_SEPARATOR,
  ID_KEY,
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
      const label = option[AUTHORITATIVE_LABEL_URI]?.[0]?.[VALUE_KEY] ?? '';
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

export const getBFGroup = (typeMap: FieldTypeMap, propertyURI: string) =>
  Object.values(typeMap).find(({ field }) => field.uri === propertyURI);

export const filterLookupOptionsByMappedValue = (lookupData: MultiselectOption[], propertyURI?: string) => {
  if (!propertyURI) return lookupData;

  let filteredLookupData = lookupData;
  const typesMap = BFLITE_TYPES_MAP;
  const bfGroup = getBFGroup(typesMap as FieldTypeMap, propertyURI);

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
) => {
  if (!lookupData) return;

  if (!parentBlockUri || !propertyURI) return lookupData;

  let filteredLookupData = lookupData;
  const typesMap = BFLITE_TYPES_MAP;
  const bfGroup = getBFGroup(typesMap as FieldTypeMap, propertyURI);

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
