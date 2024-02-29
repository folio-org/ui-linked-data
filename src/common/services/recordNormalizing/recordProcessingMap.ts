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
    processor: (record: RecordEntry, blockKey: string, groupKey: string) =>
      moveFromBlock(record, blockKey, groupKey, 'http://bibfra.me/vocab/lite/Instance'),
  },
  'http://bibfra.me/vocab/marc/production': {
    processor: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/publication': {
    processor: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/distribution': {
    processor: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/manufacture': {
    processor: processProvisionActivity,
  },
  'http://bibfra.me/vocab/marc/copyright': {
    processor: (record: RecordEntry, blockKey: string, groupKey: string) =>
      extractValue(record, blockKey, groupKey, 'http://bibfra.me/vocab/lite/date'),
  },
  'http://bibfra.me/vocab/marc/issuance': {
    processor: wrapSimpleLookupData,
  },
  _notes: {
    processor: notesMapping,
  },
  'http://bibfra.me/vocab/lite/extent': {
    processor: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_extent'),
  },
  'http://bibfra.me/vocab/lite/creator': {
    processor: processCreator,
  },
  'http://bibfra.me/vocab/lite/contributor': {
    processor: processCreator,
  },
  'http://bibfra.me/vocab/marc/targetAudience': {
    processor: wrapSimpleLookupData,
  },
  'http://bibfra.me/vocab/marc/summary': {
    processor: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_notes'),
  },
  'http://bibfra.me/vocab/marc/tableOfContents': {
    processor: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupValues(record, blockKey, groupKey, '_notes'),
  },
  'http://bibfra.me/vocab/lite/language': {
    processor: (record: RecordEntry, blockKey: string, groupKey: string) =>
      processComplexGroupWithLookup(record, blockKey, groupKey, '_language'),
  },
};
