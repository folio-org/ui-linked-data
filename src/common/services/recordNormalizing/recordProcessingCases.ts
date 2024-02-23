import {
  BFLITE_URIS,
  NEW_BF2_TO_BFLITE_MAPPING,
  NON_BF_RECORD_ELEMENTS,
} from '@common/constants/bibframeMapping.constants';

// TODO: add edge cases for:
// Instance:  "Extent"
// Work: "Primary Contributor", "Other contributors"

// Change the Dropdown options contract; apply it to the "deparsing";
// Add procesing for the Complex lookup fields;
// Update the record processing with the workReference of instanceReference;
// Add the Work mapping

const getLabelUri = (blockKey: string, groupKey: string, fieldKey: string) => {
  const typedMap = NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap;

  return typedMap?.[blockKey]?.[groupKey]?.fields?.[fieldKey]?.label || '';
};

export const moveFromBlock = (record: any, blockKey: string, toBlockKey: string, groupKey: string) => {
  if (!record[blockKey][groupKey]) return;

  record[toBlockKey][groupKey] = record[blockKey][groupKey];

  delete record[blockKey][groupKey];
};

export const wrapWithContainer = (record: any, blockKey: string, key: string, container: string) => {
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

export const wrapSimpleLookupData = (record: any, blockKey: string, key: string) => {
  if (!record[blockKey][key]) return;

  const label = getLabelUri(blockKey, key, key);

  record[blockKey][key] = record[blockKey][key].map(recordEntry => ({ [label]: [recordEntry] }));
};

export const notesMapping = (record: any, blockKey: string) => {
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

export const extractValue = (record: any, blockKey: string, key: string, source: string) => {
  if (!record[blockKey]?.[key]) return;

  record[blockKey][key] = record[blockKey][key].map(recordEntry => recordEntry[source]);
};
