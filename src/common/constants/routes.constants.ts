export const ROUTE_PATH = {
  RESOURCES: 'resources',
  CREATE: 'create',
  EDIT: 'edit',
};

export const ROUTES = {
  MAIN: {
    uri: '/',
    name: 'ld.main',
  },
  SEARCH: {
    uri: '/search',
    name: 'ld.searchResource',
  },
  RESOURCE_CREATE: {
    uri: `/${ROUTE_PATH.RESOURCES}/${ROUTE_PATH.CREATE}`,
    name: 'ld.create',
  },
  RESOURCE_EDIT: {
    uri: `/${ROUTE_PATH.RESOURCES}/:resourceId/${ROUTE_PATH.EDIT}`,
    name: 'ld.editResource',
  },
  EXTERNAL_RESOURCE_PREVIEW: {
    uri: `/${ROUTE_PATH.RESOURCES}/external/:externalId/preview`,
    name: 'ld.externalResourcePreview',
  },
};

export const RESOURCE_URLS = [ROUTES.RESOURCE_EDIT.uri];
export const EXTERNAL_RESOURCE_URLS = [ROUTES.EXTERNAL_RESOURCE_PREVIEW.uri];

export const RESOURCE_EDIT_CREATE_URLS = [ROUTES.RESOURCE_EDIT.uri, ROUTES.RESOURCE_CREATE.uri];

export const RESOURCE_CREATE_URLS = [ROUTES.RESOURCE_CREATE.uri];

export const FIXED_HEIGHT_VIEWS = [ROUTES.SEARCH.uri];

export enum QueryParams {
  Type = 'type',
  Ref = 'ref',
  CloneOf = 'cloneOf',
}

export enum SearchQueryParams {
  Query = 'query',
  SearchBy = 'searchBy',
  Offset = 'offset',
}

export enum ForceNavigateToDest {
  EditPage = 'editPage',
  CreatePage = 'createPage',
  CreatePageAsClone = 'createPageAsClone',
}
