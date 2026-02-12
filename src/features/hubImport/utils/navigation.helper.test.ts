import { generateHubImportPreviewUrl } from './navigation.helper';

describe('navigation.helper', () => {
  describe('generateHubImportPreviewUrl', () => {
    it('Generates hub import preview URL with encoded sourceUri', () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub_123';
      const result = generateHubImportPreviewUrl(hubUri);

      expect(result).toBe(`/import/hub/preview?sourceUri=${encodeURIComponent(hubUri)}`);
    });

    it('Generates hub import preview URL with numeric token in URI', () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/456';
      const result = generateHubImportPreviewUrl(hubUri);

      expect(result).toBe(`/import/hub/preview?sourceUri=${encodeURIComponent(hubUri)}`);
    });

    it('Generates hub import preview URL with special characters in URI', () => {
      const hubUri = 'http://id.loc.gov/resources/hubs/hub-special_123';
      const result = generateHubImportPreviewUrl(hubUri);

      expect(result).toBe(`/import/hub/preview?sourceUri=${encodeURIComponent(hubUri)}`);
    });
  });
});
