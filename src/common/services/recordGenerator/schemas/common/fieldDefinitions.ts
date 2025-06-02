import { BFLITE_URIS, SIMPLE_LOOKUP_MAPPING } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';

// Basic field types
export const stringArrayField = {
  type: RecordSchemaEntryType.array,
  value: RecordSchemaEntryType.string,
};

// Common field groups
export const basicTitleFields = {
  [BFLITE_URIS.MARC_PART_NAME]: stringArrayField,
  [BFLITE_URIS.MARC_PART_NUMBER]: stringArrayField,
  [BFLITE_URIS.MAIN_TITLE]: stringArrayField,
};

export const standardTitleFields = {
  ...basicTitleFields,
  [BFLITE_URIS.MARC_SUB_TITLE]: stringArrayField,
  [BFLITE_URIS.BFLC_NON_SORT_NUM]: stringArrayField,
};

export const extendedTitleFields = {
  ...standardTitleFields,
  [BFLITE_URIS.NOTE]: stringArrayField,
  [BFLITE_URIS.DATE]: stringArrayField,
};

export const variantTitleFields = {
  ...standardTitleFields,
  [BFLITE_URIS.NOTE]: stringArrayField,
  [BFLITE_URIS.DATE]: stringArrayField,
  [BFLITE_URIS.VARIANT_TYPE]: stringArrayField,
};

export const providerPlaceFields = {
  [BFLITE_URIS.NAME]: stringArrayField,
  [BFLITE_URIS.LABEL]: stringArrayField,
  [BFLITE_URIS.LINK]: stringArrayField,
};

export const providerFields = {
  [BFLITE_URIS.MARC_DATE]: stringArrayField,
  [BFLITE_URIS.NAME]: stringArrayField,
  [BFLITE_URIS.LITE_PROVIDER_DATE]: stringArrayField,
  [BFLITE_URIS.LITE_PLACE]: stringArrayField,
  [BFLITE_URIS.PROVIDER_PLACE]: {
    type: RecordSchemaEntryType.array,
    value: RecordSchemaEntryType.object,
    fields: providerPlaceFields,
  },
};

export const statusFields = {
  [BFLITE_URIS.MARC_LABEL]: stringArrayField,
  [BFLITE_URIS.LINK]: stringArrayField,
};

export const linkAndTermFields = {
  [BFLITE_URIS.TERM]: stringArrayField,
  [BFLITE_URIS.LINK]: stringArrayField,
};

export const codeTermLinkFields = {
  [BFLITE_URIS.CODE]: stringArrayField,
  [BFLITE_URIS.TERM]: stringArrayField,
  [BFLITE_URIS.LINK]: stringArrayField,
};

export const nameAndLinkFields = {
  [BFLITE_URIS.NAME]: stringArrayField,
  [BFLITE_URIS.LINK]: stringArrayField,
};

export const contributorFields = {
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
