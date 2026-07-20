import {
  PREFERRED_PROFILE_SETTINGS_PATH,
  PROFILE_API_ENDPOINT,
  PROFILE_METADATA_API_ENDPOINT,
  PROFILE_PREFERRED_API_ENDPOINT,
  PROFILE_SETTINGS_PATH,
} from '@/common/constants/api.constants';

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

export const fetchAllSettingsForProfile = (profileId: string | number) =>
  baseApi.getJson({
    url: `${PROFILE_API_ENDPOINT}/${profileId}/${PROFILE_SETTINGS_PATH}`,
  }) as Promise<ProfileSettingsMetaList>;

export const fetchProfileSettings = (profileId: string | number, profileSettingsId: string | number) =>
  baseApi.getJson({
    url: `${PROFILE_API_ENDPOINT}/${profileId}/${PROFILE_SETTINGS_PATH}/${profileSettingsId}`,
  }) as Promise<ProfileSettings>;

export const createProfileSettings = async (profileId: string | number, settings: ProfileSettings) => {
  const url = `${PROFILE_API_ENDPOINT}/${profileId}/${PROFILE_SETTINGS_PATH}`;
  const body = JSON.stringify(settings);

  const response = await baseApi.request({
    url,
    requestParams: {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/json',
      },
    },
  });

  return response?.json();
};

export const saveProfileSettings = (
  profileId: string | number,
  profileSettingsId: string | number,
  settings: ProfileSettings,
) => {
  const url = `${PROFILE_API_ENDPOINT}/${profileId}/${PROFILE_SETTINGS_PATH}/${profileSettingsId}`;
  const body = JSON.stringify(settings);

  return baseApi.request({
    url,
    requestParams: {
      method: 'PUT',
      body,
      headers: {
        'content-type': 'application/json',
      },
    },
  });
};

export const fetchPreferredProfileSettings = (profileId: string | number) =>
  baseApi.getJson({
    url: `${PROFILE_API_ENDPOINT}/${profileId}/${PREFERRED_PROFILE_SETTINGS_PATH}`,
  }) as Promise<ProfileSettingsMetaList>;

export const savePreferredProfileSettings = (profileId: string | number, profileSettingsId: number) => {
  const url = `${PROFILE_API_ENDPOINT}/${profileId}/${PREFERRED_PROFILE_SETTINGS_PATH}`;
  const body = JSON.stringify({ profileSettingsId });

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

export const deletePreferredProfileSettings = (profileId: string | number) => {
  const url = `${PROFILE_API_ENDPOINT}/${profileId}/${PREFERRED_PROFILE_SETTINGS_PATH}`;

  return baseApi.request({
    url,
    requestParams: {
      method: 'DELETE',
    },
  });
};
