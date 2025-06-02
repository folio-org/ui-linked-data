import { BFLITE_URIS, SIMPLE_LOOKUP_MAPPING } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import {
  stringArrayField,
  standardTitleFields,
  extendedTitleFields,
  providerFields,
  statusFields,
  linkAndTermFields,
  codeTermLinkFields,
  nameAndLinkFields
} from '../../common/fieldDefinitions';
import {
  createObjectField,
  createArrayObjectField,
  createNotesField,
  createStatusField,
  createStringArrayField
} from '../../common/schemaBuilders';

export const monographInstanceRecordSchema: RecordSchema = {
  [BFLITE_URIS.INSTANCE]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
      references: [
        {
          outputField: '_workReference',
        },
      ],
    },
    fields: {
      [BFLITE_URIS.TITLE]: createArrayObjectField({
        [BFLITE_URIS.TITLE]: createObjectField(standardTitleFields),
        [BFLITE_URIS.MARC_VARIANT_TITLE]: createObjectField(standardTitleFields),
        [BFLITE_URIS.MARC_PARALLEL_TITLE]: createObjectField(extendedTitleFields),
      }),
      
      [BFLITE_URIS.MARC_STATEMENT_OF_RESPONSIBILITY]: stringArrayField,
      [BFLITE_URIS.EDITION]: stringArrayField,
      
      [BFLITE_URIS.PROVISION_ACTIVITY]: createArrayObjectField({
        [BFLITE_URIS.PUBLICATION]: createArrayObjectField(providerFields),
        [BFLITE_URIS.DISTRIBUTION]: createArrayObjectField(providerFields),
        [BFLITE_URIS.MANUFACTURE]: createArrayObjectField(providerFields),
        [BFLITE_URIS.PRODUCTION]: createArrayObjectField(providerFields),
      }, { hiddenWrapper: true }),
      
      [BFLITE_URIS.COPYRIGHT]: createStringArrayField({
        valueContainer: {
          field: BFLITE_URIS.DATE,
          type: 'array',
        },
      }),
      
      [BFLITE_URIS.ISSUANCE]: stringArrayField,
      
      [BFLITE_URIS.MAP]: createArrayObjectField({
        [BFLITE_URIS.IDENTIFIER_LCCN]: createObjectField({
          [BFLITE_URIS.NAME]: stringArrayField,
          [BFLITE_URIS.MARC_STATUS]: createStatusField(statusFields),
        }),
        [BFLITE_URIS.IDENTIFIER_ISBN]: createObjectField({
          [BFLITE_URIS.NAME]: stringArrayField,
          [BFLITE_URIS.MARC_STATUS]: createStatusField(statusFields),
        }),
      }),
      
      [BFLITE_URIS.NOTES]: createNotesField(SIMPLE_LOOKUP_MAPPING._notes),
      
      [BFLITE_URIS.MARC_SUPPLEMENTARY_CONTENT]: createArrayObjectField(nameAndLinkFields),
      
      [BFLITE_URIS.MARC_MEDIA]: createArrayObjectField(codeTermLinkFields),
      
      [BFLITE_URIS.EXTENT]: stringArrayField,
      [BFLITE_URIS.MARC_DIMENSIONS]: stringArrayField,
      
      [BFLITE_URIS.MARC_CARRIER]: createArrayObjectField(linkAndTermFields),
      
      [BFLITE_URIS.MARC_ACCESS_LOCATION]: createArrayObjectField({
        [BFLITE_URIS.LINK]: stringArrayField,
        [BFLITE_URIS.NOTE]: stringArrayField,
      }),
    },
  },
};