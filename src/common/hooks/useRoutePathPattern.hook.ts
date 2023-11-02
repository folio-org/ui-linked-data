import { matchPath, useLocation } from 'react-router-dom';

export const useRoutePathPattern = (routes: string[]): string | undefined => {
  const { pathname } = useLocation();

  return routes.find(route => matchPath(route, pathname));
};
