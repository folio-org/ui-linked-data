export const ROUTES = {
  MAIN: {
    uri: '/',
    name: 'marva.main',
  },
  DASHBOARD: {
    uri: '/dashboard',
    name: 'marva.dashboard',
  },
  SEARCH: {
    uri: '/search',
    name: 'marva.searchResource',
  },
  RESOURCE_CREATE: {
    uri: '/resources/add-new',
    name: 'marva.create',
  },
  RESOURCE_EDIT: {
    uri: '/resources/:resourceId/edit',
    name: 'marva.edit',
  },
};

export const RESOURCE_URLS = [ROUTES.RESOURCE_EDIT.uri];

export const FIXED_HEIGHT_VIEWS = [ROUTES.SEARCH.uri];
