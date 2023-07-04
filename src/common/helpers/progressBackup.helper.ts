export const NEW_RECORD_KEY = 'marva_new_record';

export const generateRecordBackupKey = (profile: string, recordId: number | string = NEW_RECORD_KEY) =>
  `${profile}:${recordId}`;
