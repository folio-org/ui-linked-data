export const MAX_LIMIT = 100;
export const OKAPI_PREFIX = 'okapi';
export const OKAPI_CONFIG = 'okapi_config';
export const EDITOR_API_BASE_PATH = 'EDITOR_API_BASE_PATH';

// API endpoints
export const BIBFRAME_API_ENDPOINT = '/resource';
export const PROFILE_API_ENDPOINT = '/profile';
export const SEARCH_API_ENDPOINT = '/search/linked-data';
export const SEARCH_RESOURCE_API_ENDPOINT = `${SEARCH_API_ENDPOINT}/works`;

export const DEFAULT_PAGES_METADATA = {
  totalElements: 0,
  totalPages: 0,
};

export enum ExternalResourceIdType {
  Inventory = 'inventory',
}

export const GET_RESOURCE_BY_TYPE_URIS = {
  [ExternalResourceIdType.Inventory]: `${BIBFRAME_API_ENDPOINT}/preview/:recordId`,
};
