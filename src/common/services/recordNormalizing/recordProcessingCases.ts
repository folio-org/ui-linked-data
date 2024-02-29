import {
  BFLITE_URIS,
  NEW_BF2_TO_BFLITE_MAPPING,
  NON_BF_RECORD_ELEMENTS,
} from '@common/constants/bibframeMapping.constants';

const getLabelUri = (blockKey: string, groupKey: string, fieldKey: string) => {
  const typedMap = NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap;

  return typedMap?.[blockKey]?.[groupKey]?.fields?.[fieldKey]?.label || '';
};

export const moveFromBlock = (record: any, blockKey: string, groupKey: string, toBlockKey: string) => {
  record[toBlockKey][groupKey] = record[blockKey][groupKey];

  delete record[blockKey][groupKey];
};

export const wrapWithContainer = (record: any, blockKey: string, key: string, container: string) => {
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
  const label = getLabelUri(blockKey, key, key);

  record[blockKey][key] = record[blockKey][key].map((recordEntry: string) => ({ [label]: [recordEntry] }));
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
  record[blockKey][key] = record[blockKey][key].map(recordEntry => recordEntry[source]);
};

export const processComplexGroupValues = (record: any, blockKey: string, key: string, fieldName: string) => {
  record[blockKey][key] = record[blockKey][key].map((recordEntry: string[]) => ({
    [fieldName]: recordEntry,
  }));
};

export const processCreator = (record: any, blockKey: string, key: string) => {
  const selector = NON_BF_RECORD_ELEMENTS[BFLITE_URIS.CREATOR].container;
  const label = getLabelUri(blockKey, key, selector);

  record[blockKey][key] = record[blockKey][key].map(recordEntry => {
    for (const entryKey in recordEntry) {
      const additionalField = recordEntry[entryKey]?.[selector];

      if (!selector || !additionalField) continue;

      recordEntry[entryKey] = {
        ...recordEntry[entryKey],
        [selector]: additionalField?.map((role: string) => ({
          [BFLITE_URIS.LINK]: [role],
          [label]: [''],
        })),
      };
    }

    return recordEntry;
  });
};

export const processComplexGroupWithLookup = (record: any, blockKey: string, key: string, fieldName: string) => {
  const label = getLabelUri(blockKey, key, fieldName);

  record[blockKey][key] = record[blockKey][key].map((recordEntry: string[]) => ({
    [fieldName]: { [label]: [recordEntry] },
  }));
};
