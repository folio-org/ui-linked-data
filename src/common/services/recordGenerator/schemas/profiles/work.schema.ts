import { SIMPLE_LOOKUP_MAPPING, BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import {
  stringArrayProperty,
  standardTitleProperties,
  extendedTitleProperties,
  variantTitleProperties,
  statusProperties,
  linkAndTermProperties,
  contributorProperties,
  nameAndLinkProperties,
  assigningSourceProperty,
  seriesProperties,
} from '../common/propertyDefinitions';
import {
  createObjectProperty,
  createArrayObjectProperty,
  createNotesProperty,
  createStatusProperty,
  createLanguagesProperty,
} from '../common/schemaBuilders';

export const workRecordSchema: RecordSchema = {
  [BFLITE_URIS.WORK]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
      references: [
        {
          outputProperty: '_instanceReference',
        },
      ],
    },
    properties: {
      _creatorReference: createArrayObjectProperty(contributorProperties),

      [BFLITE_URIS.TITLE]: createArrayObjectProperty({
        [BFLITE_URIS.TITLE_CONTAINER]: createObjectProperty(standardTitleProperties),
        [BFLITE_URIS.MARC_VARIANT_TITLE]: createObjectProperty(variantTitleProperties),
        [BFLITE_URIS.MARC_PARALLEL_TITLE]: createObjectProperty(extendedTitleProperties),
      }),

      [BFLITE_URIS.ILLUSTRATIONS]: createArrayObjectProperty(linkAndTermProperties),

      [BFLITE_URIS.GOVERNMENT_PUBLICATION]: createArrayObjectProperty(linkAndTermProperties),

      [BFLITE_URIS.MARC_SUPPLEMENTARY_CONTENT]: createArrayObjectProperty(linkAndTermProperties),

      [BFLITE_URIS.DATE_START]: stringArrayProperty,

      [BFLITE_URIS.ORIGIN_PLACE]: createArrayObjectProperty(nameAndLinkProperties),

      [BFLITE_URIS.GEOGRAPHIC_COVERAGE]: createArrayObjectProperty({
        _geographicCoverageReference: stringArrayProperty,
      }),

      [BFLITE_URIS.TARGET_AUDIENCE]: createArrayObjectProperty(linkAndTermProperties),

      _contributorReference: createArrayObjectProperty(contributorProperties),

      _notes: createNotesProperty(SIMPLE_LOOKUP_MAPPING._notes),

      [BFLITE_URIS.SUMMARY]: stringArrayProperty,

      [BFLITE_URIS.SUBJECT]: createArrayObjectProperty({
        label: stringArrayProperty,
      }),

      [BFLITE_URIS.TABLE_OF_CONTENTS]: stringArrayProperty,

      [BFLITE_URIS.CLASSIFICATION]: createArrayObjectProperty(
        {
          lc: createObjectProperty({
            [BFLITE_URIS.CODE]: stringArrayProperty,
            [BFLITE_URIS.ITEM_NUMBER]: stringArrayProperty,
            [BFLITE_URIS.MARC_STATUS]: createStatusProperty(statusProperties),
            _assigningSourceReference: assigningSourceProperty,
          }),
          ddc: createObjectProperty({
            [BFLITE_URIS.CODE]: stringArrayProperty,
            [BFLITE_URIS.ITEM_NUMBER]: stringArrayProperty,
            [BFLITE_URIS.EDITION]: stringArrayProperty,
            [BFLITE_URIS.EDITION_NUMBER]: stringArrayProperty,
            _assigningSourceReference: assigningSourceProperty,
          }),
        },
        {
          flattenDropdown: true,
          sourceProperty: BFLITE_URIS.SOURCE,
        },
      ),

      [BFLITE_URIS.CONTENT]: createArrayObjectProperty({
        [BFLITE_URIS.TERM]: stringArrayProperty,
        [BFLITE_URIS.LINK]: stringArrayProperty,
      }),

      [BFLITE_URIS.LANGUAGES]: createLanguagesProperty(),

      [BFLITE_URIS.IS_PART_OF]: createArrayObjectProperty(seriesProperties),

      [BFLITE_URIS.MARC_CHARACTERISTIC]: createArrayObjectProperty(linkAndTermProperties),
    },
  },
};
