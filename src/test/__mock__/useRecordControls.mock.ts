export const saveRecord = jest.fn();
export const discardRecord = jest.fn();

jest.mock('@common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    saveRecord,
    discardRecord,
  }),
}));
