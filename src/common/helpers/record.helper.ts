import { AUTOCLEAR_TIMEOUT } from '../constants/storage.constants';
import { localStorageService } from '../services/storage';
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

export const saveRecordLocally = (profile: string, parsedRecord: RecursiveRecordSchema, recordId: RecordID) => {
  const storageKey = generateRecordBackupKey(profile, recordId);
  const newRecord = {
    createdAt: new Date().getTime(),
    data: parsedRecord,
  };

  localStorageService.serialize(storageKey, newRecord);
};

export const getSavedRecord = (profile: string, recordId?: RecordID): LocallySavedRecord | null => {
  const key = generateRecordBackupKey(profile, recordId);
  const savedRecordData = localStorageService.deserialize(key);

  return savedRecordData ? autoClearSavedData(savedRecordData, profile, recordId) : null;
};

export const autoClearSavedData = (savedRecordData: LocallySavedRecord, profile: string, recordId?: RecordID) => {
  const shouldBeCleared = savedRecordData.createdAt + AUTOCLEAR_TIMEOUT <= new Date().getTime();

  if (!shouldBeCleared) return savedRecordData;

  deleteRecordLocally(profile, recordId);

  return null;
};
