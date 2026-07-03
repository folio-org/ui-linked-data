import baseApi from '@/common/api/base.api';
import {
  createProfileSettings,
  deletePreferredProfile,
  fetchAllSettingsForProfile,
  fetchProfile,
  fetchProfileSettings,
  fetchProfiles,
  savePreferredProfile,
  saveProfileSettings,
} from '@/common/api/profiles.api';

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

    const result = await fetchProfile('1');

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: '/linked-data/profile/1',
    });
    expect(result).toEqual(testResult);
  });

  test('fetchProfiles - calls "baseApi.request" with correct parameters', async () => {
    const resourceType = 'monograph';
    const testResult = [
      {
        id: 3,
        name: 'Monograph',
        resourceType: resourceType,
      },
    ];

    jest.spyOn(baseApi, 'getJson').mockResolvedValue(testResult);

    const result = await fetchProfiles(resourceType);

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: `/linked-data/profile/metadata?resourceType=${encodeURIComponent(resourceType)}`,
    });

    expect(result).toEqual(testResult);
  });

  test('savePreferredProfile - calls "baseApi.request" with correct parameters', async () => {
    const mockUrl = 'test-url';
    const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
    const profileId = '123';
    const resourceType = 'monograph';

    jest.spyOn(baseApi, 'generateUrl').mockReturnValue(mockUrl);
    jest.spyOn(baseApi, 'request').mockResolvedValue(mockResponse);

    const result = await savePreferredProfile(profileId, resourceType);

    expect(baseApi.generateUrl).toHaveBeenCalledWith('/linked-data/profile/preferred');
    expect(baseApi.request).toHaveBeenCalledWith({
      url: mockUrl,
      requestParams: {
        method: 'POST',
        body: JSON.stringify({ id: profileId, resourceType }),
        headers: {
          'content-type': 'application/json',
        },
      },
    });
    expect(result).toEqual(mockResponse);
  });

  test('savePreferredProfile - handles numeric profile ID correctly', async () => {
    const mockUrl = 'test-url';
    const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
    const profileId = 123;
    const resourceType = 'monograph';

    jest.spyOn(baseApi, 'generateUrl').mockReturnValue(mockUrl);
    jest.spyOn(baseApi, 'request').mockResolvedValue(mockResponse);

    const result = await savePreferredProfile(profileId, resourceType);

    expect(baseApi.request).toHaveBeenCalledWith({
      url: mockUrl,
      requestParams: {
        method: 'POST',
        body: JSON.stringify({ id: profileId, resourceType }),
        headers: {
          'content-type': 'application/json',
        },
      },
    });
    expect(result).toEqual(mockResponse);
  });

  describe('deletePreferredProfile', () => {
    test('calls baseApi.request with DELETE method and resource type query parameter', async () => {
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
      const resourceType = 'work-url' as ResourceTypeURL;

      jest.spyOn(baseApi, 'request').mockResolvedValue(mockResponse);

      const result = await deletePreferredProfile(resourceType);

      expect(baseApi.request).toHaveBeenCalledWith({
        url: `/linked-data/profile/preferred?resourceType=${encodeURIComponent(resourceType)}`,
        requestParams: {
          method: 'DELETE',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    test('handles Instance resource type correctly', async () => {
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
      const resourceType = 'instance-url' as ResourceTypeURL;

      jest.spyOn(baseApi, 'request').mockResolvedValue(mockResponse);

      const result = await deletePreferredProfile(resourceType);

      expect(baseApi.request).toHaveBeenCalledWith({
        url: `/linked-data/profile/preferred?resourceType=${encodeURIComponent(resourceType)}`,
        requestParams: {
          method: 'DELETE',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  test('fetchAllSettingsForProfile', async () => {
    const profileId = 15;
    const testResult = [
      {
        id: 3,
        profileId: 15,
        name: 'settings name',
      },
    ];

    jest.spyOn(baseApi, 'getJson').mockResolvedValue(testResult);

    const result = await fetchAllSettingsForProfile(profileId);

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: `/linked-data/profile/${profileId}/settings`,
    });

    expect(result).toEqual(testResult);
  });

  test('fetchProfileSettings', async () => {
    const profileId = 15;
    const profileSettingsId = 3;
    const testResult = [
      {
        id: 'profile:resource',
        type: 'block',
      },
    ];

    jest.spyOn(baseApi, 'getJson').mockResolvedValue(testResult);

    const result = await fetchProfileSettings(profileId, profileSettingsId);

    expect(baseApi.getJson).toHaveBeenCalledWith({
      url: `/linked-data/profile/${profileId}/settings/${profileSettingsId}`,
    });

    expect(result).toEqual(testResult);
  });

  test('createProfileSettings', async () => {
    const profileId = 54;
    const name = 'created name';
    const settings = {
      name,
      active: true,
      children: [],
    } as ProfileSettings;
    const testResult = {
      id: 442,
      profileId: profileId,
      name: name,
    };

    const mockBaseApiRequest = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(testResult) }),
    ) as jest.Mock;

    jest.spyOn(baseApi, 'request').mockImplementation(mockBaseApiRequest);

    expect(await createProfileSettings(profileId, settings)).toEqual(testResult);

    expect(baseApi.request).toHaveBeenCalledWith({
      url: `/linked-data/profile/${profileId}/settings`,
      requestParams: {
        method: 'POST',
        body: JSON.stringify(settings),
        headers: {
          'content-type': 'application/json',
        },
      },
    });

    expect(mockBaseApiRequest).toHaveBeenCalled();
  });

  test('saveProfileSettings', async () => {
    const profileId = 54;
    const profileSettingsId = 5903;
    const settings = {
      id: profileSettingsId,
      name: 'save settings',
      active: true,
      children: [],
    } as ProfileSettings;
    const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 201 });

    jest.spyOn(baseApi, 'request').mockResolvedValue(mockResponse);

    const result = await saveProfileSettings(profileId, profileSettingsId, settings);

    expect(baseApi.request).toHaveBeenCalledWith({
      url: `/linked-data/profile/${profileId}/settings/${profileSettingsId}`,
      requestParams: {
        method: 'PUT',
        body: JSON.stringify(settings),
        headers: {
          'content-type': 'application/json',
        },
      },
    });
    expect(result).toEqual(mockResponse);
  });
});
