import {
  BFLITE_URIS,
  NEW_BF2_TO_BFLITE_MAPPING,
  NON_BF_RECORD_ELEMENTS,
} from '@common/constants/bibframeMapping.constants';
import { EXTERNAL_DATA_SOURCE_URIS } from '@common/constants/bibframe.constants';

export const getLabelUri = (blockKey: string, groupKey: string, fieldKey: string) => {
  const typedMap = NEW_BF2_TO_BFLITE_MAPPING as BF2BFLiteMap;

  return typedMap?.[blockKey]?.[groupKey]?.fields?.[fieldKey]?.label || '';
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

  record[blockKey][key] = (record[blockKey][key] as unknown as RecordProcessingCreatorDTO).map(recordEntry => {
    const generatedValue = {
      id: [recordEntry.id],
      label: [recordEntry.label],
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

export const processComplexGroupWithLookup = (
  record: RecordEntry,
  blockKey: string,
  key: string,
  fieldName: string,
) => {
  const label = getLabelUri(blockKey, key, fieldName);

  record[blockKey][key] = (record[blockKey][key] as unknown as string[]).map(recordEntry => ({
    [fieldName]: {
      [label]: [recordEntry],
      [BFLITE_URIS.LINK]: [`${EXTERNAL_DATA_SOURCE_URIS.LANGUAGE}/${recordEntry}`],
    },
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
