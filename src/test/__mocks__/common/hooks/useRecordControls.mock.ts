export const fetchRecord = jest.fn();
export const fetchRecordAndSelectEntityValues = jest.fn();
export const fetchExternalRecordForPreview = jest.fn();
export const getRecordAndInitializeParsing = jest.fn();

jest.mock('@/common/hooks/useRecordControls', () => ({
  useRecordControls: () => ({
    fetchRecord,
    fetchRecordAndSelectEntityValues,
    fetchExternalRecordForPreview,
    getRecordAndInitializeParsing,
  }),
}));
