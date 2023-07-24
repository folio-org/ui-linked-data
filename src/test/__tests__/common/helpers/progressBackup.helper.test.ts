import { generateRecordBackupKey } from '@common/helpers/progressBackup.helper';

describe('progressBackup.helper', () => {
  describe('generateRecordBackupKey', () => {
    function testGenerateRecordBackupKey(
      profile: string | undefined,
      recordId: number | string | undefined,
      testResult: string,
    ) {
      const result = generateRecordBackupKey(profile, recordId);

      expect(result).toBe(testResult);
    }

    test('returns generated key with default params', () => {
      testGenerateRecordBackupKey(undefined, undefined, 'lc:profile:bf2:Monograph:marva_new_record');
    });

    test('returns generated key with passed profile', () => {
      testGenerateRecordBackupKey('testProfile', undefined, 'testProfile:marva_new_record');
    });

    test('returns generated key with passed recordID', () => {
      testGenerateRecordBackupKey(undefined, 'testRecordId', 'lc:profile:bf2:Monograph:testRecordId');
    });

    test('returns generated key with all passed params', () => {
      testGenerateRecordBackupKey('testProfile', 'testRecordId', 'testProfile:testRecordId');
    });
  });
});
