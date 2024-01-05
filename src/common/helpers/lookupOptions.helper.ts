import { TYPE_MAP } from '@common/constants/bibframeMapping.constants';
import { AUTHORITATIVE_LABEL_URI, BLANK_NODE_TRAIT, ID_KEY, VALUE_KEY } from '@common/constants/lookup.constants';

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

      return {
        value: { label, uri: optionUri },
        label,
        __isNew__: false,
      };
    });

export const filterLookupOptions = (lookupData: MultiselectOption[], propertyURI?: string) => {
  let filteredLookupData = lookupData;

  if (!propertyURI) return filteredLookupData;

  const BFGroup = Object.values(TYPE_MAP).find(({ field }) => field.uri === propertyURI);

  if (BFGroup) {
    const BF20Uris = Object.values(BFGroup.data);

    filteredLookupData = lookupData.filter(({ value }) => BF20Uris.includes(value.uri));
  }

  return filteredLookupData;
};
