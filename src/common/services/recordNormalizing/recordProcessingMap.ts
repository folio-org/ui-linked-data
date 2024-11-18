import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import {
  wrapWithContainer,
  extractValue,
  wrapSimpleLookupData,
  notesMapping,
  processComplexGroupValues,
  processCreator,
  processComplexGroupWithLookup,
  extractDropdownOption,
} from './recordProcessingCases';

const processProvisionActivity = (record: RecordEntry, blockKey: string, groupKey: string) =>
  wrapWithContainer(record, blockKey, groupKey, BFLITE_URIS.PROVISION_ACTIVITY);

export const RECORD_NORMALIZING_CASES = {
  [BFLITE_URIS.PRODUCTION]: {
    process: processProvisionActivity,
  },
  [BFLITE_URIS.PUBLICATION]: {
    process: processProvisionActivity,
  },
  [BFLITE_URIS.DISTRIBUTION]: {
    process: processProvisionActivity,
  },
  [BFLITE_URIS.MANUFACTURE]: {
    process: processProvisionActivity,
  },
  [BFLITE_URIS.COPYRIGHT]: {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      extractValue(record, blockKey, groupKey, BFLITE_URIS.DATE),
  },
  [BFLITE_URIS.ISSUANCE]: {
    process: wrapSimpleLookupData,
  },
  _notes: {
    process: notesMapping,
  },
  [BFLITE_URIS.EXTENT]: {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_extent'),
  },
  _creatorReference: {
    process: processCreator,
  },
  _contributorReference: {
    process: processCreator,
  },
  [BFLITE_URIS.SUMMARY]: {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_notes'),
  },
  [BFLITE_URIS.TABLE_OF_CONTENTS]: {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_notes'),
  },
  [BFLITE_URIS.LANGUAGE]: {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupWithLookup(record, blockKey, groupKey, '_language'),
  },
  [BFLITE_URIS.CLASSIFICATION]: {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      extractDropdownOption(
        record,
        blockKey,
        groupKey,
        BFLITE_URIS.SOURCE,
        '_assigningSourceReference',
      ),
  },
};
