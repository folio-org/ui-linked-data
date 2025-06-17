import baseApi from '@common/api/base.api';
import { fetchProfile } from '@common/api/profiles.api';

describe('profiles.api', () => {
  test('fetchProfile - calls "baseApi.getJson" with profile ID and returns profile data', async () => {
    const testResult = {
      data: {
        profile: {
          id: 'monograph',
          name: 'Monograph',
        },
      },
    };
    jest.spyOn(baseApi, 'getJson').mockResolvedValue(testResult);

    const result = await fetchProfile(1);

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/linked-data/profile/1',
    });
    expect(result).toEqual(testResult);
  });

  test('fetchProfile - uses default profile ID when none is provided', async () => {
    const testResult = {
      data: {
        profile: {
          id: '1',
          name: 'Monograph',
        },
      },
    };
    jest.spyOn(baseApi, 'getJson').mockResolvedValue(testResult);

    const result = await fetchProfile();

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/linked-data/profile/1',
    });
    expect(result).toEqual(testResult);
  });
});
