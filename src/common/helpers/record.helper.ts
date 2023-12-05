import { cloneDeep } from 'lodash';
import { AUTOCLEAR_TIMEOUT } from '@common/constants/storage.constants';
import { localStorageService } from '@common/services/storage';
import { generateRecordBackupKey } from './progressBackup.helper';
import { IDENTIFIER_AS_VALUE, INSTANTIATES_TO_INSTANCE_FIELDS, TYPE_URIS } from '@common/constants/bibframe.constants';
import { BFLITE_URIS } from '@common/constants/bibframeMapping.constants';

export const getRecordId = (record: RecordEntry | null) => record?.resource?.[TYPE_URIS.INSTANCE].id;

export const getRecordWithUpdatedID = (record: RecordEntry, id: RecordID) => ({
  resource: {
    ...record.resource,
    [TYPE_URIS.INSTANCE]: { ...record.resource[TYPE_URIS.INSTANCE], id },
  },
});

export const formatRecord = (parsedRecord: ParsedRecord) => {
  const workComponent = parsedRecord[BFLITE_URIS.INSTANTIATES] as unknown as RecursiveRecordSchema[];
  const instanceComponent = parsedRecord[TYPE_URIS.INSTANCE] as unknown as Record<string, RecursiveRecordSchema[]>;

  if (workComponent && Object.keys(workComponent).length && instanceComponent) {
    instanceComponent[BFLITE_URIS.INSTANTIATES as string] = [workComponent] as unknown as RecursiveRecordSchema[];
  }

  delete parsedRecord[BFLITE_URIS.INSTANTIATES];

  return {
    resource: {
      ...parsedRecord,
      [TYPE_URIS.INSTANCE]: updateInstanciatesWithInstanceFields(instanceComponent),
    },
  };
};

export const updateInstanciatesWithInstanceFields = (
  instanceComponent: Record<string, RecursiveRecordSchema[] | RecursiveRecordSchema>,
) => {
  const clonedInstance = cloneDeep(instanceComponent);
  const instantiatesComponent = clonedInstance[BFLITE_URIS.INSTANTIATES as string];
  const instantiatesComponentTyped = instantiatesComponent as unknown as Record<string, unknown>[];

  INSTANTIATES_TO_INSTANCE_FIELDS.forEach(fieldName => {
    const componentToMove = clonedInstance[fieldName];

    if (!componentToMove) return;

    if (instantiatesComponent) {
      instantiatesComponentTyped[0] = { ...instantiatesComponentTyped[0], [fieldName]: componentToMove };
    } else {
      clonedInstance[BFLITE_URIS.INSTANTIATES as string] = [{ [fieldName]: componentToMove } as RecursiveRecordSchema];
    }

    delete clonedInstance[fieldName];
  });

  return clonedInstance;
};

export const deleteRecordLocally = (profile: string, recordId?: RecordID) => {
  const storageKey = generateRecordBackupKey(profile, recordId);

  localStorageService.delete(storageKey);
};

export const generateRecordData = (record: ParsedRecord) => {
  return {
    createdAt: new Date().getTime(),
    data: record,
  };
};

export const generateAndSaveRecord = (storageKey: string, record: ParsedRecord) => {
  const newRecord = generateRecordData(record);

  localStorageService.serialize(storageKey, newRecord);

  return newRecord;
};

export const saveRecordLocally = (profile: string, record: ParsedRecord, recordId: RecordID) => {
  const storageKey = generateRecordBackupKey(profile, recordId);
  const formattedRecord = formatRecord(record);
  const updatedRecord = getRecordWithUpdatedID(formattedRecord as RecordEntry, recordId);

  return generateAndSaveRecord(storageKey, updatedRecord as ParsedRecord);
};

export const getSavedRecord = (profile: string, recordId?: RecordID): LocallySavedRecord | null => {
  const storageKey = generateRecordBackupKey(profile, recordId);
  const savedRecordData = localStorageService.deserialize(storageKey);

  if (savedRecordData && !savedRecordData?.data) {
    return generateAndSaveRecord(storageKey, savedRecordData);
  }

  return savedRecordData ? autoClearSavedData(savedRecordData, profile, recordId) : null;
};

export const autoClearSavedData = (savedRecordData: LocallySavedRecord, profile: string, recordId?: RecordID) => {
  const shouldBeCleared = savedRecordData.createdAt + AUTOCLEAR_TIMEOUT <= new Date().getTime();

  if (!shouldBeCleared) return savedRecordData;

  deleteRecordLocally(profile, recordId);

  return null;
};

export const checkIdentifierAsValue = (record: Record<string, string[]>, uri: string) => {
  const identifierAsValueSelection = IDENTIFIER_AS_VALUE[uri];

  if (identifierAsValueSelection) {
    const { field, value } = identifierAsValueSelection;
    const typedRecord = record as Record<string, string[]>;

    if (typedRecord?.[field]?.includes(value)) {
      return typedRecord;
    }
  }

  return false;
};
