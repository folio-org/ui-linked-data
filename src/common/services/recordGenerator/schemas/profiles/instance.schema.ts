import { BFLITE_URIS, SIMPLE_LOOKUP_MAPPING } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import {
  stringArrayProperty,
  standardTitleProperties,
  extendedTitleProperties,
  providerProperties,
  statusProperties,
  linkAndTermProperties,
  codeTermLinkProperties,
  nameAndLinkProperties
} from '../common/propertyDefinitions';
import {
  createObjectProperty,
  createArrayObjectProperty,
  createNotesProperty,
  createStatusProperty,
  createStringArrayProperty
} from '../common/schemaBuilders';

export const instanceRecordSchema: RecordSchema = {
  [BFLITE_URIS.INSTANCE]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
      references: [
        {
          outputProperty: '_workReference',
        },
      ],
    },
    properties: {
      [BFLITE_URIS.TITLE]: createArrayObjectProperty({
        [BFLITE_URIS.TITLE]: createObjectProperty(standardTitleProperties),
        [BFLITE_URIS.MARC_VARIANT_TITLE]: createObjectProperty(standardTitleProperties),
        [BFLITE_URIS.MARC_PARALLEL_TITLE]: createObjectProperty(extendedTitleProperties),
      }),
      
      [BFLITE_URIS.MARC_STATEMENT_OF_RESPONSIBILITY]: stringArrayProperty,
      [BFLITE_URIS.EDITION]: stringArrayProperty,
      
      [BFLITE_URIS.PROVISION_ACTIVITY]: createArrayObjectProperty({
        [BFLITE_URIS.PUBLICATION]: createArrayObjectProperty(providerProperties),
        [BFLITE_URIS.DISTRIBUTION]: createArrayObjectProperty(providerProperties),
        [BFLITE_URIS.MANUFACTURE]: createArrayObjectProperty(providerProperties),
        [BFLITE_URIS.PRODUCTION]: createArrayObjectProperty(providerProperties),
      }, { hiddenWrapper: true }),
      
      [BFLITE_URIS.COPYRIGHT]: createStringArrayProperty({
        valueContainer: {
          property: BFLITE_URIS.DATE,
          type: 'array',
        },
      }),
      
      [BFLITE_URIS.ISSUANCE]: stringArrayProperty,
      
      [BFLITE_URIS.MAP]: createArrayObjectProperty({
        [BFLITE_URIS.IDENTIFIER_LCCN]: createObjectProperty({
          [BFLITE_URIS.NAME]: stringArrayProperty,
          [BFLITE_URIS.MARC_STATUS]: createStatusProperty(statusProperties),
        }),
        [BFLITE_URIS.IDENTIFIER_ISBN]: createObjectProperty({
          [BFLITE_URIS.NAME]: stringArrayProperty,
          [BFLITE_URIS.MARC_STATUS]: createStatusProperty(statusProperties),
        }),
        [BFLITE_URIS.IDENTIFIER_ISSN]: createObjectProperty({
          [BFLITE_URIS.NAME]: stringArrayProperty,
          [BFLITE_URIS.MARC_STATUS]: createStatusProperty(statusProperties),
        }),
        [BFLITE_URIS.IDENTIFIER_IAN]: createObjectProperty({
          [BFLITE_URIS.NAME]: stringArrayProperty,
          [BFLITE_URIS.MARC_STATUS]: createStatusProperty(statusProperties),
        }),
        [BFLITE_URIS.IDENTIFIER_OTHER]: createObjectProperty({
          [BFLITE_URIS.NAME]: stringArrayProperty,
          [BFLITE_URIS.MARC_STATUS]: createStatusProperty(statusProperties),
        }),        
      }),
      
      [BFLITE_URIS.NOTES]: createNotesProperty(SIMPLE_LOOKUP_MAPPING._notes),
      
      [BFLITE_URIS.MARC_SUPPLEMENTARY_CONTENT]: createArrayObjectProperty(nameAndLinkProperties),
      
      [BFLITE_URIS.MARC_MEDIA]: createArrayObjectProperty(codeTermLinkProperties),
      
      [BFLITE_URIS.EXTENT]: createArrayObjectProperty({
        [BFLITE_URIS.LABEL]: stringArrayProperty,
        [BFLITE_URIS.APPLIES_TO]: stringArrayProperty,
      }),

      [BFLITE_URIS.MARC_DIMENSIONS]: stringArrayProperty,
      
      [BFLITE_URIS.MARC_CARRIER]: createArrayObjectProperty(linkAndTermProperties),
      
      [BFLITE_URIS.MARC_ACCESS_LOCATION]: createArrayObjectProperty({
        [BFLITE_URIS.LINK]: stringArrayProperty,
        [BFLITE_URIS.NOTE]: stringArrayProperty,
      }),

      [BFLITE_URIS.BOOK_FORMAT]: createArrayObjectProperty(linkAndTermProperties),
    },
  },
};