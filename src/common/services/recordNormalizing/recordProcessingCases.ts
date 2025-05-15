import {
  BFLITE_URIS,
  NEW_BF2_TO_BFLITE_MAPPING,
  NON_BF_RECORD_ELEMENTS,
} from '@common/constants/bibframeMapping.constants';

export const getLabelUri = (blockKey: string, groupKey: string, fieldKey: string) => {
  const typedMap = NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap;

  return typedMap?.[blockKey]?.[groupKey]?.fields?.[fieldKey]?.label ?? '';
};

export const wrapWithContainer = (record: RecordEntry, blockKey: string, key: string, container: string) => {
  (record[blockKey][key] as unknown as string[]).forEach(recordEntry => {
    const wrappedRecordEntry = { [key]: recordEntry };
    const containerData = record[blockKey][container] as unknown as Record<string, unknown>[];

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

  record[blockKey][key] = (record[blockKey][key] as unknown as RecordProcessingDTO).map(recordEntry => {
    const generatedValue = {
      id: [recordEntry.id],
      label: {
        value: [recordEntry.label],
        isPreferred: recordEntry.isPreferred,
      },
    } as unknown as Record<string, string[] | Record<string, string[]>[]>;

    if (recordEntry[selector]) {
      generatedValue[selector] = (recordEntry[selector] as unknown as string[])?.map((role: string) => ({
        [BFLITE_URIS.LINK]: [role],
        [label]: [''],
      }));
    }

    return {
      [recordEntry.type as unknown as string]: generatedValue,
    };
  }) as unknown as RecursiveRecordSchema;
};

export const processComplexLookup = (record: RecordEntry, blockKey: string, key: string) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as RecordProcessingDTO).map(recordEntry => {
    const generatedValue = {
      id: [recordEntry.id],
      _name: {
        value: [recordEntry.label],
        isPreferred: recordEntry.isPreferred,
      },
    } as unknown as RecursiveRecordSchema;

    if (recordEntry.type) {
      generatedValue._subclass = recordEntry.type as unknown as string;
    }

    if (recordEntry.roles) {
      generatedValue._relationship = (recordEntry.roles as unknown as string[])?.map((role: string) => ({
        [BFLITE_URIS.LINK]: [role],
        [BFLITE_URIS.LABEL]: [''],
      })) as unknown as string[];
    }

    return generatedValue;
  }) as unknown as RecursiveRecordSchema;
};

export const processComplexGroupWithLookup = (
  record: RecordEntry,
  blockKey: string,
  key: string,
  fieldName: string,
) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as string[]).map(recordEntry => ({
    [fieldName]: recordEntry,
  })) as unknown as RecursiveRecordSchema;
};

export const extractDropdownOption = (
  record: RecordEntry,
  blockKey: string,
  key: string,
  fieldName: string,
  lookupFieldName: string,
) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as RecordBasic[]).map(recordEntry => {
    const updatedValues: Record<string, unknown> = {};

    for (const entryKey in recordEntry) {
      if (entryKey === fieldName) continue;

      updatedValues[entryKey] =
        entryKey === lookupFieldName
          ? (recordEntry[entryKey] as unknown as RecordProcessingDTO).map(({ id, label }) => ({
              id,
              label: [label],
            }))
          : recordEntry[entryKey];
    }

    return { [recordEntry[fieldName][0]]: updatedValues };
  }) as unknown as RecursiveRecordSchema;
};
