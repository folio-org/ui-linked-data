import baseApi from '@common/api/base.api';
import { fetchProfiles, fetchProfile } from '@common/api/profiles.api';

describe('profiles.api', () => {
  test('fetchProfiles - calls "baseApi.getJson" and returns profile data', async () => {
    const testResult = {
      data: {
        profiles: [
          {
            id: 'profileId_1',
            name: 'Profile 1',
            json: {
              Profile: {
                resourceTemplates: [
                  {
                    id: 'templateId_1',
                    name: 'Template 1',
                  },
                ],
              },
            },
          },
        ],
      },
    };
    jest.spyOn(baseApi, 'getJson').mockResolvedValue(testResult);

    const result = await fetchProfiles();

    expect(baseApi.getJson).toHaveBeenCalledTimes(1);
    expect(result).toEqual(testResult);
  });

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

    const result = await fetchProfile('monograph');

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/linked-data/profile/monograph',
    });
    expect(result).toEqual(testResult);
  });

  test('fetchProfile - uses default profile ID when none is provided', async () => {
    const testResult = {
      data: {
        profile: {
          id: 'monograph',
          name: 'Monograph',
        },
      },
    };
    jest.spyOn(baseApi, 'getJson').mockResolvedValue(testResult);

    const result = await fetchProfile();

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/linked-data/profile/monograph',
    });
    expect(result).toEqual(testResult);
  });
});
