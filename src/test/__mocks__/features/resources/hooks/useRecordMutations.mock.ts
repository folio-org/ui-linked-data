export const saveRecord = jest.fn();
export const deleteRecord = jest.fn();
export const changeRecordProfile = jest.fn();

jest.mock('@/features/resources/hooks/useRecordMutations', () => ({
  useRecordMutations: () => ({ saveRecord, deleteRecord, changeRecordProfile }),
}));
