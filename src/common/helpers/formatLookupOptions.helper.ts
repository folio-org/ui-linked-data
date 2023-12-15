import { AUTHORITATIVE_LABEL_URI, BLANK_NODE_TRAIT, ID_KEY, VALUE_KEY } from '@common/constants/lookup.constants';

export const formatLookupOptions = (data: LoadSimpleLookupResponseItem[], parentURI?: string): MultiselectOption[] => {
  const options = data
    .filter(dataItem => {
      const id = dataItem[ID_KEY];
      return id != parentURI && !id?.includes(BLANK_NODE_TRAIT);
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

  return options;
};
