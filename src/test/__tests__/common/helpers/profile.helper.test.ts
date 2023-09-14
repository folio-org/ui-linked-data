import { shouldSelectDropdownOption } from '@common/helpers/profile.helper';

describe('profile.helper', () => {
  describe('shouldSelectDropdownOption', () => {
    const uri = 'testUri';

    test('returns true for the first dropdown option', () => {
      const firstOfSameType = true;

      const result = shouldSelectDropdownOption({ uri, firstOfSameType });

      expect(result).toBeTruthy();
    });

    test('returns true for the option that was saved in the record', () => {
      const firstOfSameType = false;
      const record = [{ testUri: {} }];

      const result = shouldSelectDropdownOption({ uri, record, firstOfSameType });

      expect(result).toBeTruthy();
    });

    test('returns false', () => {
      const result = shouldSelectDropdownOption({ uri });

      expect(result).toBeFalsy();
    });
  });
});
