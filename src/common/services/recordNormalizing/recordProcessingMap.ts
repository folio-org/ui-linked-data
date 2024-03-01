import {
  moveFromBlock,
  wrapWithContainer,
  extractValue,
  wrapSimpleLookupData,
  notesMapping,
  processComplexGroupValues,
  processCreator,
  processComplexGroupWithLookup,
} from './recordProcessingCases';

const processProvisionActivity = (record: RecordEntry, blockKey: string, groupKey: string) =>
  wrapWithContainer(record, blockKey, groupKey, 'https://bibfra.me/vocab/marc/provisionActivity');

export const RECORD_NORMALIZING_CASES = {
  'http://bibfra.me/vocab/marc/responsibilityStatement': {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      moveFromBlock(record, blockKey, groupKey, 'http://bibfra.me/vocab/lite/Instance'),
  },
  'http://bibfra.me/vocab/marc/production': {
    process: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/publication': {
    process: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/distribution': {
    process: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/manufacture': {
    process: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/copyright': {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      extractValue(record, blockKey, groupKey, 'http://bibfra.me/vocab/lite/date'),
  },
  'http://bibfra.me/vocab/marc/issuance': {
    process: wrapSimpleLookupData,
  },
  _notes: {
    process: notesMapping,
  },
  'http://bibfra.me/vocab/lite/extent': {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_extent'),
  },
  'http://bibfra.me/vocab/lite/creator': {
    process: processCreator,
  },
  'http://bibfra.me/vocab/lite/contributor': {
    process: processCreator,
  },
  'http://bibfra.me/vocab/marc/targetAudience': {
    process: wrapSimpleLookupData,
  },
  'http://bibfra.me/vocab/marc/summary': {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_notes'),
  },
  'http://bibfra.me/vocab/marc/tableOfContents': {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_notes'),
  },
  'http://bibfra.me/vocab/lite/language': {
    process: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupWithLookup(record, blockKey, groupKey, '_language'),
  },
};
