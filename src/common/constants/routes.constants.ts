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
    uri: '/resources/create',
    name: 'marva.create',
  },
  RESOURCE_EDIT: {
    uri: '/resources/:resourceId/edit',
    name: 'marva.editResource',
  },
};

export const RESOURCE_URLS = [ROUTES.RESOURCE_EDIT.uri];

export const RESOURCE_EDIT_CREATE_URLS = [ROUTES.RESOURCE_EDIT.uri, ROUTES.RESOURCE_CREATE.uri];

export const RESOURCE_CREATE_URLS = [ROUTES.RESOURCE_CREATE.uri];

export const FIXED_HEIGHT_VIEWS = [ROUTES.SEARCH.uri];

export enum QueryParams {
  Type = 'type',
  Ref = 'ref',
}
