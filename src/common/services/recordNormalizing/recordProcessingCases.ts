import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';
import { getLookupLabelKey } from '@common/helpers/schema.helper';

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
  const label = getLookupLabelKey(key);

  record[blockKey][key] = (record[blockKey][key] as unknown as string[]).map(recordEntry => ({
    [label]: [recordEntry],
  })) as unknown as RecursiveRecordSchema;
};

export const notesMapping = (record: RecordEntry, blockKey: string) => {
  const selector = '_notes';

  if (!record[blockKey][selector]) return;

  record[blockKey][selector] = (record[blockKey][selector] as unknown as RecordBasic[]).map(recordEntry => ({
    ...recordEntry,
    type: [
      {
        [BFLITE_URIS.LINK]: recordEntry.type,
        [BFLITE_URIS.LABEL]: [''],
      },
    ],
  })) as unknown as RecursiveRecordSchema;
};

export const languagesMapping = (record: RecordEntry, blockKey: string) => {
  const selector = '_languages';

  if (!record[blockKey][selector]) return;

  record[blockKey][selector] = (record[blockKey][selector] as unknown as RecordBasic[]).map(recordEntry => ({
    ...recordEntry,
    _types: recordEntry._types[0],
  })) as unknown as RecursiveRecordSchema;
};

export const extractValue = (record: RecordEntry, blockKey: string, key: string, source: string) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as RecordWithNestedFieldsDTO).map(
    recordEntry => recordEntry[source],
  ) as unknown as RecursiveRecordSchema;
};

export const processComplexLookup = (record: RecordEntry, blockKey: string, key: string, fieldName: string) => {
  record[blockKey][key] = (record[blockKey][key] as unknown as RecordProcessingDTO).map(recordEntry => {
    const generatedValue = {
      id: [recordEntry.id],
    } as unknown as RecursiveRecordSchema;

    generatedValue[fieldName] = {
      value: [recordEntry.label],
      isPreferred: recordEntry.isPreferred,
    } as unknown as RecordBasic;

    if (recordEntry.type) {
      generatedValue._subclass = recordEntry.type as unknown as string;
    }

    if (recordEntry.roles) {
      generatedValue.roles = (recordEntry.roles as unknown as string[])?.map((role: string) => ({
        [BFLITE_URIS.LINK]: [role],
        [BFLITE_URIS.LABEL]: [''],
      })) as unknown as string[];
    }

    return generatedValue;
  }) as unknown as RecursiveRecordSchema;
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
