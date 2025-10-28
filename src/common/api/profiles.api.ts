import {
  PROFILE_API_ENDPOINT,
  PROFILE_METADATA_API_ENDPOINT,
  PROFILE_PREFERRED_API_ENDPOINT,
} from '@common/constants/api.constants';
import baseApi from './base.api';

export const fetchProfile = (profileId: string | number) =>
  baseApi.getJson({
    url: `${PROFILE_API_ENDPOINT}/${profileId}`,
  }) as Promise<Profile>;

export const fetchProfiles = (resourceType: string) =>
  baseApi.getJson({
    url: `${PROFILE_METADATA_API_ENDPOINT}?resourceType=${encodeURIComponent(resourceType)}`,
  }) as Promise<ProfileDTO[]>;

export const fetchPreferredProfiles = (resourceType?: string) => {
  const url = resourceType
    ? `${PROFILE_PREFERRED_API_ENDPOINT}?resourceType=${encodeURIComponent(resourceType)}`
    : PROFILE_PREFERRED_API_ENDPOINT;

  return baseApi.getJson({ url }) as Promise<ProfileDTO[]>;
};

export const savePreferredProfile = (id: string | number, resourceType: string) => {
  const url = baseApi.generateUrl(PROFILE_PREFERRED_API_ENDPOINT);
  const body = JSON.stringify({ id, resourceType });

  return baseApi.request({
    url,
    requestParams: {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/json',
      },
    },
  });
};

export const deletePreferredProfile = (resourceType: ResourceTypeURL) => {
  const url = `${PROFILE_PREFERRED_API_ENDPOINT}?resourceType=${encodeURIComponent(resourceType)}`;

  return baseApi.request({
    url,
    requestParams: {
      method: 'DELETE',
    },
  });
};
