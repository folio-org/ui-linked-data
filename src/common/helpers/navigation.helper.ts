import { ROUTES, QueryParams, ForceNavigateToDest } from '@common/constants/routes.constants';
import { matchPath } from 'react-router-dom';

export const generateEditResourceUrl = (resourceId?: string | number) => `/resources/${resourceId}/edit`;

export const getForceNavigateToDest = (pathname: string, search?: string): ForceNavigateToDest | undefined => {
  const navigatingToCreatePage = matchPath(ROUTES.RESOURCE_CREATE.uri, pathname) && search;

  if (navigatingToCreatePage && search.includes(QueryParams.CloneOf)) return ForceNavigateToDest.CreatePageAsClone;

  if (navigatingToCreatePage) return ForceNavigateToDest.CreatePage;

  if (matchPath(ROUTES.RESOURCE_EDIT.uri, pathname)) return ForceNavigateToDest.EditPage;
};
