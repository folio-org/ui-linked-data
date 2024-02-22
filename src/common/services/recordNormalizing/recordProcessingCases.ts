import {
  BFLITE_URIS,
  NEW_BF2_TO_BFLITE_MAPPING,
  NON_BF_RECORD_ELEMENTS,
} from '@common/constants/bibframeMapping.constants';

// TODO: add edge cases for:
// Instance:  "Extent"
// Work: "Primary Contributor", "Other contributors"

const getLabelUri = (blockKey: string, groupKey: string, fieldKey: string) => {
  const typedMap = NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap;

  return typedMap?.[blockKey]?.[groupKey]?.fields?.[fieldKey]?.label || '';
};

const moveFromBlock = (record: any, blockKey: string, toBlockKey: string, groupKey: string) => {
  if (!record[blockKey][groupKey]) return;

  record[toBlockKey][groupKey] = record[blockKey][groupKey];

  delete record[blockKey][groupKey];
};

const wrapWithContainer = (record: any, blockKey: string, key: string, container: string) => {
  if (!record[blockKey][key]) return;

  record[blockKey][key].forEach(recordEntry => {
    if (record[blockKey][container]) {
      record[blockKey][container] = [...record[blockKey][container], { [key]: recordEntry }];
    } else {
      record[blockKey][container] = [{ [key]: recordEntry }];
    }
  });

  delete record[blockKey][key];
};

const wrapSimpleLookupData = (record: any, blockKey: string, key: string) => {
  if (!record[blockKey][key]) return;

  const label = getLabelUri(blockKey, key, key);

  record[blockKey][key] = record[blockKey][key].map(recordEntry => ({ [label]: [recordEntry] }));
};

const notesMapping = (record: any, blockKey: string) => {
  const selector = NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container;

  if (!record[blockKey][selector]) return;

  const label = getLabelUri(blockKey, selector, 'type');

  record[blockKey][selector] = record[blockKey][selector].map(recordEntry => {
    recordEntry.type = [
      {
        [BFLITE_URIS.LINK]: recordEntry.type,
        [label]: [''],
      },
    ];

    return recordEntry;
  });
};

const extractValue = (record: any, blockKey: string, key: string, source: string) => {
  if (!record[blockKey]?.[key]) return;

  record[blockKey][key] = record[blockKey][key].map(recordEntry => recordEntry[source]);
};

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
