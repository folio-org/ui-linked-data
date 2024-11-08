import baseApi from '@common/api/base.api';
import { localStorageService } from '@common/services/storage';

describe('base.api', () => {
  test('doRequest', async () => {
    const resolvable = { errors: [{ type: 'mockType', message: 'mockMessage' }] };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(resolvable),
      }),
    ) as jest.Mock;

    const spyLogError = jest
      .spyOn(console, 'error')
      .mockImplementation((message: any, error: Error) => ({ message, error }));

    localStorageService.deserialize = jest.fn();

    await expect(baseApi.request({ url: 'mockUrl' })).rejects.toBe(resolvable);
    expect(spyLogError).toHaveBeenCalledWith('mockType: mockMessage');
  });
});
