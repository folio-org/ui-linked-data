import baseApi from '@common/api/base.api';
import { getGraphIdByExternalId } from '@common/api/records.api';

describe('records.api', () => {
  describe('getGraphIdByExternalId', () => {
    test('returns graph id', async () => {
      const testResult = { id: 'mockId' };

      const mockBaseApiRequest = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(testResult) }),
      ) as jest.Mock;

      jest.spyOn(baseApi, 'request').mockImplementation(mockBaseApiRequest);

      expect(await getGraphIdByExternalId({ recordId: 'anyId' })).toEqual(testResult);
      expect(mockBaseApiRequest).toHaveBeenCalled();
    });
  });
});
