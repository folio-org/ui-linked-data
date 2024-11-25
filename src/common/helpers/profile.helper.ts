import { LOOKUPS_WITH_SIMPLE_STRUCTURE, LOC_GOV_URI } from '@common/constants/bibframe.constants';
import { BFLITE_URIS, TYPE_MAP } from '@common/constants/bibframeMapping.constants';
import { AdvancedFieldType } from '@common/constants/uiControls.constants';
import { getLookupLabelKey } from './schema.helper';

export const hasElement = (collection: string[], uri?: string) => !!uri && collection.includes(uri);

export const generateLookupValue = ({
  uriBFLite,
  label,
  basicLabel,
  uri,
  type,
  nonBFMappedGroup,
}: {
  uriBFLite?: string;
  label?: string;
  basicLabel?: string;
  uri?: string;
  type?: AdvancedFieldType;
  nonBFMappedGroup?: NonBFMappedGroup;
}) => {
  let lookupValue;
  const selectedLabel = basicLabel ?? label;

  if (LOOKUPS_WITH_SIMPLE_STRUCTURE.includes(uriBFLite as string) || type === AdvancedFieldType.complex) {
    lookupValue = selectedLabel;
  } else if (nonBFMappedGroup) {
    // Get mapped lookup value for BFLite format
    lookupValue = uri?.includes(LOC_GOV_URI) ? getMappedLookupValue({ uri, nonBFMappedGroup }) : uri;
  } else {
    lookupValue = {
      [getLookupLabelKey(uriBFLite)]: [selectedLabel],
      [BFLITE_URIS.LINK]: [uri],
    };
  }

  return lookupValue;
};

export const getMappedLookupValue = ({
  uri = '',
  nonBFMappedGroup,
}: {
  uri: string;
  nonBFMappedGroup?: NonBFMappedGroup;
}) => {
  if (!nonBFMappedGroup) return uri;

  const groupTypeMap = TYPE_MAP[nonBFMappedGroup.uri];
  let mappedUri = uri;

  if (groupTypeMap) {
    // Find lookup value in the map
    const selectedMappedUri = Object.entries(groupTypeMap.data)?.find(([_, value]) => value.uri === uri)?.[0];

    mappedUri = selectedMappedUri ?? uri;
  }

  return mappedUri;
};

export const filterUserValues = (userValues: UserValues) =>
  Object.values(userValues).reduce((accum, current) => {
    const { contents, uuid } = current;

    if (!contents.length) return accum;

    const filteredContents = contents.filter(({ label }) => label?.length);

    if (!filteredContents.length) return accum;

    accum[uuid] = { ...current, contents: filteredContents };

    return accum;
  }, {} as UserValues);
