export const generateHubImportPreviewUrl = (hubUri: string): string => {
  return `/import/hub/preview?sourceUri=${encodeURIComponent(hubUri)}`;
};
