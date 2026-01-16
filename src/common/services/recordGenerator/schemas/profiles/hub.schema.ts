import { BFLITE_URIS } from '@/common/constants/bibframeMapping.constants';
import { RecordSchemaEntryType } from '@/common/constants/recordSchema.constants';

export const hubRecordSchema: RecordSchema = {
  [BFLITE_URIS.HUB]: {
    type: RecordSchemaEntryType.object,
    options: {
      isRootEntry: true,
    },
  },
};
