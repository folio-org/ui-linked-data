import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';

import {
  contributorProperties,
  linkAndTermProperties,
  standardTitleProperties,
  variantTitleProperties,
} from '../common/propertyDefinitions';
import { createArrayObjectProperty, createObjectProperty } from '../common/schemaBuilders';

export const hubRecordSchema: RecordSchema = {
  [BFLITE_URIS.HUB]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
    },
    properties: {
      _creatorReference: createArrayObjectProperty(contributorProperties),

      [BFLITE_URIS.TITLE]: createArrayObjectProperty({
        [BFLITE_URIS.TITLE_CONTAINER]: createObjectProperty(standardTitleProperties),
        [BFLITE_URIS.LIBRARY_VARIANT_TITLE]: createObjectProperty(variantTitleProperties),
      }),

      [BFLITE_URIS.LANGUAGE]: createArrayObjectProperty(linkAndTermProperties),
    },
  },
};
