import { QueryParams, ROUTES } from '@/common/constants/routes.constants';

export const generateHubImportPreviewUrl = (hubUri: string): string => {
  return `${ROUTES.HUB_IMPORT_PREVIEW.uri}?${QueryParams.SourceUri}=${encodeURIComponent(hubUri)}`;
};
