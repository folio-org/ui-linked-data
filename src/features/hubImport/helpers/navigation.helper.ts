export const generateHubImportPreviewUrl = (hubToken: string): string => {
  const baseUrl = `/import/hub/${hubToken}/preview`;

  return baseUrl;
};
