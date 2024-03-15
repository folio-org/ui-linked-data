import {
  BFLITE_URIS,
  NEW_BF2_TO_BFLITE_MAPPING,
  NON_BF_RECORD_ELEMENTS,
} from '@common/constants/bibframeMapping.constants';

export const getLabelUri = (blockKey: string, groupKey: string, fieldKey: string) => {
  const typedMap = NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap;

  return typedMap?.[blockKey]?.[groupKey]?.fields?.[fieldKey]?.label || '';
};

export const moveFromBlock = (record: RecordEntry, blockKey: string, groupKey: string, toBlockKey: string) => {
  record[toBlockKey][groupKey] = record[blockKey][groupKey];

  delete record[blockKey][groupKey];
};

export const wrapWithContainer = (record: RecordEntry, blockKey: string, key: string, container: string) => {
  const containerData = record[blockKey][container] as unknown as Record<string, unknown>[];

  (record[blockKey][key] as unknown as string[]).forEach(recordEntry => {
    const wrappedRecordEntry = { [key]: recordEntry };

    record[blockKey][container] = (containerData
      ? [...containerData, wrappedRecordEntry]
      : [wrappedRecordEntry]) as unknown as RecursiveRecordSchema;
  });

  delete record[blockKey][key];
};

export const wrapSimpleLookupData = (record: RecordEntry, blockKey: string, key: string) => {
  const label = getLabelUri(blockKey, key, key);

  record[blockKey][key] = (record[blockKey][key] as unknown as string[]).map(recordEntry => ({
    [label]: [recordEntry],
  })) as unknown as RecursiveRecordSchema;
};

export const notesMapping = (record: RecordEntry, blockKey: string) => {
  const selector = NON_BF_RECORD_ELEMENTS[BFLITE_URIS.NOTE].container;

  if (!record[blockKey][selector]) return;

  const label = getLabelUri(blockKey, selector, 'type');

  record[blockKey][selector] = (record[blockKey][selector] as unknown as RecordBasic[]).map(recordEntry => ({
    ...recordEntry,
    type: [
      {
        [BFLITE_URIS.LINK]: recordEntry.type,
        [label]: [''],
      },
    ],
  })) as unknown as RecursiveRecordSchema;
};

export const extractValue = (record: RecordEntry, blockKey: string, key: string, source: string) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as RecordWithNestedFieldsDTO).map(
    recordEntry => recordEntry[source],
  ) as unknown as RecursiveRecordSchema;
};

export const processComplexGroupValues = (record: RecordEntry, blockKey: string, key: string, fieldName: string) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as RecordForComplexGroupsDTO).map(recordEntry => ({
    [fieldName]: recordEntry,
  })) as unknown as RecursiveRecordSchema;
};

export const processCreator = (record: RecordEntry, blockKey: string, key: string) => {
  const selector = NON_BF_RECORD_ELEMENTS[BFLITE_URIS.CREATOR].container;
  const label = getLabelUri(blockKey, key, selector);

  record[blockKey][key] = (record[blockKey][key] as unknown as RecordProcessingCreatorDTO).map(recordEntry => {
    const updatedRecordEntry = { ...recordEntry };

    for (const entryKey in recordEntry) {
      const additionalField = recordEntry[entryKey]?.[selector];

      if (!selector || !additionalField) continue;

      updatedRecordEntry[entryKey] = {
        ...recordEntry[entryKey],
        [selector]: (additionalField as unknown as string[])?.map((role: string) => ({
          [BFLITE_URIS.LINK]: [role],
          [label]: [''],
        })),
      } as Record<string, RecordBasic>;
    }

    return updatedRecordEntry;
  }) as unknown as RecursiveRecordSchema;
};

export const processComplexGroupWithLookup = (
  record: RecordEntry,
  blockKey: string,
  key: string,
  fieldName: string,
) => {
  const label = getLabelUri(blockKey, key, fieldName);

  record[blockKey][key] = (record[blockKey][key] as unknown as string[]).map(recordEntry => ({
    [fieldName]: { [label]: [recordEntry] },
  })) as unknown as RecursiveRecordSchema;
};

export const extractDropdownOption = (record: RecordEntry, blockKey: string, key: string, fieldName: string) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as RecordBasic[]).map(recordEntry => {
    const updatedValues = {} as RecordBasic;

    for (const entryKey in recordEntry) {
      if (entryKey === fieldName) continue;

      updatedValues[entryKey] = recordEntry[entryKey];
    }

    return { [recordEntry[fieldName][0]]: updatedValues };
  }) as unknown as RecursiveRecordSchema;
};
