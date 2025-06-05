import { PROFILE_API_ENDPOINT } from '@common/constants/api.constants';
import baseApi from './base.api';

export const fetchProfiles = () =>
  baseApi.getJson({
    url: PROFILE_API_ENDPOINT,
  });

export const fetchProfile = (profileId = 1) =>
  baseApi.getJson({
    url: `${PROFILE_API_ENDPOINT}/${profileId}`,
  });
