import { SIMPLE_LOOKUP_MAPPING, BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@common/constants/recordSchema.constants';
import {
  stringArrayField,
  standardTitleFields,
  extendedTitleFields,
  variantTitleFields,
  statusFields,
  linkAndTermFields,
  codeTermLinkFields,
  contributorFields,
  nameAndLinkFields,
} from '../../common/fieldDefinitions';
import {
  createObjectField,
  createArrayObjectField,
  createNotesField,
  createStatusField,
} from '../../common/schemaBuilders';

export const monographWorkRecordSchema: RecordSchema = {
  [BFLITE_URIS.WORK]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
      references: [
        {
          outputField: '_instanceReference',
        },
      ],
    },
    fields: {
      _creatorReference: createArrayObjectField(contributorFields),

      [BFLITE_URIS.TITLE]: createArrayObjectField({
        [BFLITE_URIS.TITLE_CONTAINER]: createObjectField(standardTitleFields),
        [BFLITE_URIS.MARC_VARIANT_TITLE]: createObjectField(variantTitleFields),
        [BFLITE_URIS.MARC_PARALLEL_TITLE]: createObjectField(extendedTitleFields),
      }),

      [BFLITE_URIS.GOVERNMENT_PUBLICATION]: createArrayObjectField(linkAndTermFields),

      [BFLITE_URIS.DATE_START]: stringArrayField,

      [BFLITE_URIS.ORIGIN_PLACE]: createArrayObjectField(nameAndLinkFields),

      [BFLITE_URIS.GEOGRAPHIC_COVERAGE]: createArrayObjectField({
        _geographicCoverageReference: stringArrayField,
      }),

      [BFLITE_URIS.TARGET_AUDIENCE]: createArrayObjectField(linkAndTermFields),

      _contributorReference: createArrayObjectField(contributorFields),

      _notes: createNotesField(SIMPLE_LOOKUP_MAPPING._notes),

      [BFLITE_URIS.SUMMARY]: stringArrayField,

      [BFLITE_URIS.SUBJECT]: createArrayObjectField({
        label: stringArrayField,
      }),

      [BFLITE_URIS.TABLE_OF_CONTENTS]: stringArrayField,

      [BFLITE_URIS.CLASSIFICATION]: createArrayObjectField(
        {
          lc: createObjectField({
            [BFLITE_URIS.CODE]: stringArrayField,
            [BFLITE_URIS.ITEM_NUMBER]: stringArrayField,
            [BFLITE_URIS.MARC_STATUS]: createStatusField(statusFields),
            _assigningSourceReference: stringArrayField,
          }),
          ddc: createObjectField({
            [BFLITE_URIS.CODE]: stringArrayField,
            [BFLITE_URIS.ITEM_NUMBER]: stringArrayField,
            [BFLITE_URIS.EDITION]: stringArrayField,
            [BFLITE_URIS.EDITION_NUMBER]: stringArrayField,
            _assigningSourceReference: stringArrayField,
          }),
        },
        {
          flattenDropdown: true,
          sourceField: BFLITE_URIS.SOURCE,
        },
      ),

      [BFLITE_URIS.CONTENT]: createArrayObjectField({
        [BFLITE_URIS.CODE]: stringArrayField,
        [BFLITE_URIS.LINK]: stringArrayField,
      }),

      [BFLITE_URIS.LANGUAGE]: createArrayObjectField(codeTermLinkFields),
    },
  },
};
