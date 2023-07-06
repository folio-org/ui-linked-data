import { PROFILE_NAMES } from '../constants/bibframe.constants';

export const NEW_RECORD_KEY = 'marva_new_record';

// TODO: define default profile that will be used for saving a new record
export const generateRecordBackupKey = (
  profile: string = PROFILE_NAMES.MONOGRAPH,
  recordId: number | string = NEW_RECORD_KEY,
) => `${profile}:${recordId}`;
