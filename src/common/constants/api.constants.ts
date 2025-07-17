export const MAX_LIMIT = 100;
export const OKAPI_PREFIX = 'okapi';
export const OKAPI_CONFIG = 'okapi_config';
export const EDITOR_API_BASE_PATH = 'EDITOR_API_BASE_PATH';

// API endpoints
export const BIBFRAME_API_ENDPOINT = '/linked-data/resource';
export const INVENTORY_API_ENDPOINT = '/linked-data/inventory-instance';
export const PROFILE_API_ENDPOINT = '/linked-data/profile';
export const PROFILE_METADATA_API_ENDPOINT = '/linked-data/profile/metadata';
export const PROFILE_PREFERRED_API_ENDPOINT = '/linked-data/profile/preferred';
export const SEARCH_API_ENDPOINT = '/search/linked-data';
export const SEARCH_RESOURCE_API_ENDPOINT = `${SEARCH_API_ENDPOINT}/works`;
export const AUTHORITY_ASSIGNMENT_CHECK_API_ENDPOINT = '/linked-data/authority-assignment-check';
export const IMPORT_JSON_FILE_API_ENDPOINT = '/linked-data/import/file';

export const DEFAULT_PAGES_METADATA = {
  totalElements: 0,
  totalPages: 0,
};

export enum ApiErrorCodes {
  AlreadyExists = 'already_exists',
  RequiredPrimaryMainTitle = 'required_primary_main_title',
  LccnDoesNotMatchPattern = 'lccn_does_not_match_pattern',
  LccnNotUnique = 'lccn_not_unique',
  FailedDependency = 'failed_dependency',
  NotFound = 'not_found',
  Mapping = 'mapping',
  GenericBadRequest = 'generic_bad_request',
  Server = 'server',
}

export enum ExternalResourceIdType {
  Inventory = 'inventory',
}

export const GET_RESOURCE_BY_TYPE_URIS = {
  [ExternalResourceIdType.Inventory]: `${INVENTORY_API_ENDPOINT}/:recordId/preview`,
};
