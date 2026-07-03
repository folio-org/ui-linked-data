import { matchPath } from 'react-router-dom';

import { ForceNavigateToDest, QueryParams, ROUTES, ROUTE_PATH } from '@/common/constants/routes.constants';

export const generateEditResourceUrl = (resourceId?: string | number) => `/resources/${resourceId}/edit`;

export const generateHubImportPreviewUrl = (hubUri: string): string => {
  return `${ROUTES.HUB_IMPORT_PREVIEW.uri}?${QueryParams.SourceUri}=${encodeURIComponent(hubUri)}`;
};

export const getForceNavigateToDest = (pathname: string, search?: string): ForceNavigateToDest | undefined => {
  const navigatingToCreatePage = matchPath(ROUTES.RESOURCE_CREATE.uri, pathname) && search;

  if (navigatingToCreatePage && search.includes(QueryParams.CloneOf)) return ForceNavigateToDest.CreatePageAsClone;

  if (navigatingToCreatePage) return ForceNavigateToDest.CreatePage;

  if (matchPath(ROUTES.RESOURCE_EDIT.uri, pathname)) return ForceNavigateToDest.EditPage;
};

export const getResourceIdFromUri = () => {
  const { pathname } = globalThis.location;

  const splittedPath = pathname.split('/');
  const isEditResourcePage = splittedPath.includes(ROUTE_PATH.RESOURCES) && splittedPath.includes(ROUTE_PATH.EDIT);

  if (!isEditResourcePage) return;

  const resourceIndex = splittedPath.indexOf(ROUTE_PATH.RESOURCES);

  return splittedPath[resourceIndex + 1];
};

export const getIsCreatePage = () => {
  const { pathname } = globalThis.location;

  return pathname === ROUTES.RESOURCE_CREATE.uri;
};

export const generatePageURL = ({
  url,
  queryParams,
  profileId,
  profileSettingsId,
}: {
  url: string;
  queryParams: Record<QueryParams, string>;
  profileId: string | number;
  profileSettingsId?: string | number;
}) => {
  const urlParams = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        urlParams.append(key, value);
      }
    });
  }

  if (profileId) {
    urlParams.set(QueryParams.ProfileId, profileId.toString());
  }

  if (profileSettingsId) {
    urlParams.set(QueryParams.ProfileSettingsId, profileSettingsId.toString());
  }

  const paramString = urlParams.toString();

  return paramString ? `${url}?${paramString}` : url;
};
