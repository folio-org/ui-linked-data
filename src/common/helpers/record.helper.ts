import { AUTOCLEAR_TIMEOUT } from '@common/constants/storage.constants';
import { localStorageService } from '@common/services/storage';
import { generateRecordBackupKey } from './progressBackup.helper';

export const formatRecord = (profile: any, parsedRecord: Record<string, object>) => {
  const formattedRecord: RecordEntry = {
    ...parsedRecord[profile],
    profile,
  };

  return formattedRecord;
};

export const deleteRecordLocally = (profile: string, recordId?: RecordID) => {
  const storageKey = generateRecordBackupKey(profile, recordId);

  localStorageService.delete(storageKey);
};

export const generateRecordData = (record: RecursiveRecordSchema) => {
  return {
    createdAt: new Date().getTime(),
    data: record,
  };
};

export const generateAndSaveRecord = (storageKey: string, record: RecursiveRecordSchema) => {
  const newRecord = generateRecordData(record);

  localStorageService.serialize(storageKey, newRecord);

  return newRecord;
};

export const saveRecordLocally = (profile: string, record: RecursiveRecordSchema, recordId: RecordID) => {
  const storageKey = generateRecordBackupKey(profile, recordId);

  return generateAndSaveRecord(storageKey, record);
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
