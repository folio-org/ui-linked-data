import { BFLITE_URIS, SIMPLE_LOOKUP_MAPPING } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

// Basic property types
export const stringArrayProperty = {
  type: RecordSchemaEntryType.array,
  value: RecordSchemaEntryType.string,
};

// Common property groups
export const basicTitleProperties = {
  [BFLITE_URIS.MARC_PART_NAME]: stringArrayProperty,
  [BFLITE_URIS.MARC_PART_NUMBER]: stringArrayProperty,
  [BFLITE_URIS.MAIN_TITLE]: stringArrayProperty,
};

export const standardTitleProperties = {
  ...basicTitleProperties,
  [BFLITE_URIS.MARC_SUB_TITLE]: stringArrayProperty,
  [BFLITE_URIS.BFLC_NON_SORT_NUM]: stringArrayProperty,
};

export const extendedTitleProperties = {
  ...standardTitleProperties,
  [BFLITE_URIS.NOTE]: stringArrayProperty,
  [BFLITE_URIS.DATE]: stringArrayProperty,
};

export const variantTitleProperties = {
  ...standardTitleProperties,
  [BFLITE_URIS.NOTE]: stringArrayProperty,
  [BFLITE_URIS.DATE]: stringArrayProperty,
  [BFLITE_URIS.VARIANT_TYPE]: stringArrayProperty,
};

export const providerPlaceProperties = {
  [BFLITE_URIS.NAME]: stringArrayProperty,
  [BFLITE_URIS.LABEL]: stringArrayProperty,
  [BFLITE_URIS.LINK]: stringArrayProperty,
};

export const providerProperties = {
  [BFLITE_URIS.MARC_DATE]: stringArrayProperty,
  [BFLITE_URIS.NAME]: stringArrayProperty,
  [BFLITE_URIS.LITE_PROVIDER_DATE]: stringArrayProperty,
  [BFLITE_URIS.LITE_PLACE]: stringArrayProperty,
  [BFLITE_URIS.PROVIDER_PLACE]: {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    properties: providerPlaceProperties,
  },
};

export const statusProperties = {
  [BFLITE_URIS.LABEL]: stringArrayProperty,
  [BFLITE_URIS.LINK]: stringArrayProperty,
};

export const linkAndTermProperties = {
  [BFLITE_URIS.TERM]: stringArrayProperty,
  [BFLITE_URIS.LINK]: stringArrayProperty,
};

export const codeTermLinkProperties = {
  [BFLITE_URIS.CODE]: stringArrayProperty,
  [BFLITE_URIS.TERM]: stringArrayProperty,
  [BFLITE_URIS.LINK]: stringArrayProperty,
};

export const nameAndLinkProperties = {
  [BFLITE_URIS.NAME]: stringArrayProperty,
  [BFLITE_URIS.LINK]: stringArrayProperty,
};

export const contributorProperties = {
  _name: {
    type: RecordSchemaEntryType.string,
    value: RecordSchemaEntryType.string,
  },
  roles: {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.string,
    options: {
      mappedValues: SIMPLE_LOOKUP_MAPPING._contributions,
    },
  },
};

export const assigningSourceProperty = {
  type: RecordSchemaEntryType.array,
  value: RecordSchemaEntryType.object,
  properties: {
    srsId: stringArrayProperty,
  },
};
