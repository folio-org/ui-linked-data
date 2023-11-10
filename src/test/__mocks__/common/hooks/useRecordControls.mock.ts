export const saveRecord = jest.fn();
export const discardRecord = jest.fn();
export const fetchRecord = jest.fn();
export const clearRecordState = jest.fn();

jest.mock('@common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    saveRecord,
    discardRecord,
    fetchRecord,
    clearRecordState,
  }),
}));
