import baseApi from '@common/api/base.api';
import { fetchProfiles } from '@common/api/profiles.api';

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
});
