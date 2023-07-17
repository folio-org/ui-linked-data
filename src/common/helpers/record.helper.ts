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

export const deleteRecordLocally = (profile: string, recordId?: number | string) => {
  const storageKey = generateRecordBackupKey(profile, recordId);

  localStorageService.delete(storageKey);
};

export const saveRecordLocally = (
  profile: string,
  parsedRecord: Record<string, object>,
  recordId: string | number | undefined,
) => {
  const storageKey = generateRecordBackupKey(profile, recordId);
  const newRecord = {
    createdAt: new Date().getTime(),
    data: parsedRecord,
  };

  localStorageService.serialize(storageKey, newRecord);
};

export const getSavedRecord = (profile: string, recordId?: string | number | undefined) => {
  const key = generateRecordBackupKey(profile, recordId);
  const savedRecordData = localStorageService.deserialize(key);

  return savedRecordData ? autoClearSavedData(profile, savedRecordData) : null;
};

export const autoClearSavedData = (profile: string, savedRecordData: any) => {
  const shouldBeCleared = savedRecordData.createdAt + AUTOCLEAR_TIMEOUT <= new Date().getTime();

  if (!shouldBeCleared) return savedRecordData;

  deleteRecordLocally(profile);

  return null;
};
