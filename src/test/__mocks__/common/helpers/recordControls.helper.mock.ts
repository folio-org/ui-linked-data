export const checkButtonDisabledState = jest.fn();

jest.mock('@common/helpers/recordControls.helper', () => ({
  checkButtonDisabledState,
}));
