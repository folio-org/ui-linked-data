export const discardRecord = jest.fn();
export const tryFetchExternalRecordForEdit = jest.fn();
export const clearRecordState = jest.fn();

jest.mock('@/features/resources/hooks/useRecordNavigation', () => ({
  useRecordNavigation: () => ({ discardRecord, tryFetchExternalRecordForEdit, clearRecordState }),
}));
