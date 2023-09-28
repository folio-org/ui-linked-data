import { AUTOCLEAR_TIMEOUT } from '@common/constants/storage.constants';
import { localStorageService } from '@common/services/storage';
import { generateRecordBackupKey } from './progressBackup.helper';
import { IS_NEW_API_ENABLED } from '@common/constants/feature.constants';
import { TYPE_URIS } from '@common/constants/bibframe.constants';

export const getRecordId = (record: RecordEntry | null) => record?.resource?.[TYPE_URIS.INSTANCE].id;

export const formatRecord = (profile: any, parsedRecord: RecordEntry) => {
  const formattedRecord = IS_NEW_API_ENABLED
    ? { resource: parsedRecord }
    : {
        ...parsedRecord[profile],
        profile,
      };

  return formattedRecord;
};

export const deleteRecordLocally = (profile: string, recordId?: RecordID) => {
  const storageKey = generateRecordBackupKey(profile, recordId);

  localStorageService.delete(storageKey);
};

export const generateRecordData = (record: SavedRecordData) => {
  return {
    createdAt: new Date().getTime(),
    data: record,
  };
};

export const generateAndSaveRecord = (storageKey: string, record: SavedRecordData) => {
  const newRecord = generateRecordData(record);

  localStorageService.serialize(storageKey, newRecord);

  return newRecord;
};

export const saveRecordLocally = (profile: string, record: SavedRecordData, recordId: RecordID) => {
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
