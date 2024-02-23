import {
  moveFromBlock,
  wrapWithContainer,
  extractValue,
  wrapSimpleLookupData,
  notesMapping,
} from './recordProcessingCases';

export const RECORD_NORMALIZING_CASES = {
  'http://bibfra.me/vocab/marc/responsibilityStatement': {
    processor: (record: RecordEntry, blockKey: string) =>
      moveFromBlock(
        record,
        blockKey,
        'http://bibfra.me/vocab/lite/Instance',
        'http://bibfra.me/vocab/marc/responsibilityStatement',
      ),
  },
  'http://bibfra.me/vocab/marc/production': {
    processor: (record: RecordEntry, blockKey: string) =>
      wrapWithContainer(
        record,
        blockKey,
        'http://bibfra.me/vocab/marc/production',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
  'http://bibfra.me/vocab/marc/publication': {
    processor: (record: RecordEntry, blockKey: string) =>
      wrapWithContainer(
        record,
        blockKey,
        'http://bibfra.me/vocab/marc/publication',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
  'http://bibfra.me/vocab/marc/distribution': {
    processor: (record: RecordEntry, blockKey: string) =>
      wrapWithContainer(
        record,
        blockKey,
        'http://bibfra.me/vocab/marc/distribution',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
  'http://bibfra.me/vocab/marc/manufacture': {
    processor: (record: RecordEntry, blockKey: string) =>
      wrapWithContainer(
        record,
        blockKey,
        'http://bibfra.me/vocab/marc/manufacture',
        'https://bibfra.me/vocab/marc/provisionActivity',
      ),
  },
  'http://bibfra.me/vocab/marc/copyright': {
    processor: (record: RecordEntry, blockKey: string) =>
      extractValue(record, blockKey, 'http://bibfra.me/vocab/marc/copyright', 'http://bibfra.me/vocab/lite/date'),
  },
  'http://bibfra.me/vocab/marc/issuance': {
    processor: (record: RecordEntry, blockKey: string) =>
      wrapSimpleLookupData(record, blockKey, 'http://bibfra.me/vocab/marc/issuance'),
  },
  _notes: {
    processor: notesMapping,
  },
};
