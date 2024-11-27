import { PROFILE_BFIDS } from '@common/constants/bibframe.constants';
import { DEFAULT_RECORD_ID } from '@common/constants/storage.constants';

// TODO: UILD-438 - define default profile that will be used for saving a new record
export const generateRecordBackupKey = (
  profile: string = PROFILE_BFIDS.MONOGRAPH,
  recordId: number | string = DEFAULT_RECORD_ID,
) => `${profile}:${recordId}`;
