import { IS_NEW_API_ENABLED } from './feature.constants';

export const MAX_LIMIT = 100;
export const OKAPI_PREFIX = 'okapi';
export const OKAPI_CONFIG = 'okapi_config';
export const EDITOR_API_BASE_PATH = 'EDITOR_API_BASE_PATH';

// API endpoints
export const BIBFRAME_API_ENDPOINT = IS_NEW_API_ENABLED ? '/resource' : '/bibframe2';
