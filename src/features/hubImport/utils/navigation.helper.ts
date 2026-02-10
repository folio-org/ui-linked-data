export const generateHubImportPreviewUrl = (hubId: string): string => {
  const baseUrl = `/import/hub/${hubId}/preview`;

  return baseUrl;
};
