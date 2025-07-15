import {
  PROFILE_API_ENDPOINT,
  PROFILE_METADATA_API_ENDPOINT,
  PROFILE_PREFERRED_API_ENDPOINT,
} from '@common/constants/api.constants';
import baseApi from './base.api';

export const fetchProfile = (profileId = 1) =>
  baseApi.getJson({
    url: `${PROFILE_API_ENDPOINT}/${profileId}`,
  }) as Promise<Profile>;

export const fetchProfiles = async (resourceType: string) =>
  (await baseApi.getJson({
    url: `${PROFILE_METADATA_API_ENDPOINT}?resourceType=${encodeURIComponent(resourceType)}`,
  })) as Promise<ProfileDTO[]>;

export const fetchPreferredProfiles = async (resourceType?: string) => {
  const url = resourceType
    ? `${PROFILE_PREFERRED_API_ENDPOINT}?resourceType=${encodeURIComponent(resourceType)}`
    : PROFILE_PREFERRED_API_ENDPOINT;

  return (await baseApi.getJson({ url })) as Promise<ProfileDTO[]>;
};
