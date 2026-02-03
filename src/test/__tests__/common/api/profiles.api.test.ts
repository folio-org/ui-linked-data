import baseApi from '@/common/api/base.api';
import { deletePreferredProfile, fetchProfile, savePreferredProfile } from '@/common/api/profiles.api';

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
});
