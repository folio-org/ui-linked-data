import { matchPath, useLocation } from 'react-router-dom';

export const useRoutePathPattern = (routes: string[]) => {
  const { pathname } = useLocation();

  return routes.find(route => matchPath(route, pathname));
};
