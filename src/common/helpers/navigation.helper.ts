import { matchPath } from 'react-router-dom';

import { ForceNavigateToDest, QueryParams, ROUTES, ROUTE_PATH } from '@/common/constants/routes.constants';

export const generateEditResourceUrl = (resourceId?: string | number) => `/resources/${resourceId}/edit`;

export const getForceNavigateToDest = (pathname: string, search?: string): ForceNavigateToDest | undefined => {
  const navigatingToCreatePage = matchPath(ROUTES.RESOURCE_CREATE.uri, pathname) && search;

  if (navigatingToCreatePage && search.includes(QueryParams.CloneOf)) return ForceNavigateToDest.CreatePageAsClone;

  if (navigatingToCreatePage) return ForceNavigateToDest.CreatePage;

  if (matchPath(ROUTES.RESOURCE_EDIT.uri, pathname)) return ForceNavigateToDest.EditPage;
};

export const getResourceIdFromUri = () => {
  const { pathname } = window.location;

  const splittedPath = pathname.split('/');
  const isEditResourcePage = splittedPath.includes(ROUTE_PATH.RESOURCES) && splittedPath.includes(ROUTE_PATH.EDIT);

  if (!isEditResourcePage) return;

  const resourceIndex = splittedPath.indexOf(ROUTE_PATH.RESOURCES);

  return splittedPath[resourceIndex + 1];
};

export const getIsCreatePage = () => {
  const { pathname } = window.location;

  return pathname === ROUTES.RESOURCE_CREATE.uri;
};

export const generatePageURL = ({
  url,
  queryParams,
  profileId,
}: {
  url: string;
  queryParams: Record<QueryParams, string>;
  profileId: string | number;
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

  const paramString = urlParams.toString();

  return paramString ? `${url}?${paramString}` : url;
};
