import { ApiErrorCodes } from '@/common/constants/api.constants';
import { checkHasErrorOfCodeType } from '@/common/helpers/api.helper';

describe('api.helper', () => {
  describe('checkHasErrorOfCodeType', () => {
    test('returns matching error', () => {
      expect(
        checkHasErrorOfCodeType({ errors: [{ code: ApiErrorCodes.AlreadyExists }] }, ApiErrorCodes.AlreadyExists),
      ).toBeTruthy();
    });
  });
});
