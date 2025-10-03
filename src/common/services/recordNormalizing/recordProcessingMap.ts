import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import {
  wrapWithContainer,
  extractValue,
  wrapSimpleLookupData,
  notesMapping,
  extractDropdownOption,
  processComplexLookup,
  languagesMapping,
  processHubsComplexLookup,
} from './recordProcessingCases';

const processProvisionActivity = (record: RecordEntry, blockKey: string, groupKey: string) =>
  wrapWithContainer(record, blockKey, groupKey, BFLITE_URIS.PROVISION_ACTIVITY);

const processContributorComplexLookup = (record: RecordEntry, blockKey: string, groupKey: string) =>
  processComplexLookup(record, blockKey, groupKey, '_name');

const processSubjectComplexLookup = (record: RecordEntry, blockKey: string, groupKey: string) =>
  processComplexLookup(record, blockKey, groupKey, 'label');

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
  _creatorReference: {
    process: processContributorComplexLookup,
  },
  _contributorReference: {
    process: processContributorComplexLookup,
  },
  _languages: {
    process: languagesMapping
  },
  [BFLITE_URIS.CLASSIFICATION]: {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      extractDropdownOption(record, blockKey, groupKey, BFLITE_URIS.SOURCE, '_assigningSourceReference'),
  },
  [BFLITE_URIS.SUBJECT]: {
    process: processSubjectComplexLookup,
  },
  _hubs: {
    process: processHubsComplexLookup
  }
};
