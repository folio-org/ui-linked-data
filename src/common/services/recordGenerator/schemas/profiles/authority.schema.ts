import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';

import { stringArrayProperty } from '../common/propertyDefinitions';

export const authorityRecordSchema: RecordSchema = {
  [BFLITE_URIS.AUTHORITY]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
    },
    properties: {
      [BFLITE_URIS.NAME]: stringArrayProperty,
      [BFLITE_URIS.NUMERATION]: stringArrayProperty,
      [BFLITE_URIS.TITLES]: stringArrayProperty,
      [BFLITE_URIS.DATE]: stringArrayProperty,
      [BFLITE_URIS.MISC_INFO]: stringArrayProperty,
      [BFLITE_URIS.ATTRIBUTION]: stringArrayProperty,
      [BFLITE_URIS.NAME_ALTERNATIVE]: stringArrayProperty,
      [BFLITE_URIS.AFFILIATION]: stringArrayProperty,
      [BFLITE_URIS.SUBORDINATE_UNIT]: stringArrayProperty,
      [BFLITE_URIS.PLACE]: stringArrayProperty,
      [BFLITE_URIS.GEOGRAPHIC_COVERAGE]: stringArrayProperty,
    },
  },
};
