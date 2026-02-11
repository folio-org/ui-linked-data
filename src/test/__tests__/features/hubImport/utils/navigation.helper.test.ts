import { generateHubImportPreviewUrl } from '@/features/hubImport/utils/navigation.helper';

describe('navigation.helper', () => {
  describe('generateHubImportPreviewUrl', () => {
    it('Generates hub import preview URL with hub id', () => {
      const hubId = 'hub_123';
      const result = generateHubImportPreviewUrl(hubId);

      expect(result).toBe('/import/hub/hub_123/preview');
    });

    it('Generates hub import preview URL with numeric hub id', () => {
      const hubId = '456';
      const result = generateHubImportPreviewUrl(hubId);

      expect(result).toBe('/import/hub/456/preview');
    });

    it('Generates hub import preview URL with special characters', () => {
      const hubId = 'hub-special_123';
      const result = generateHubImportPreviewUrl(hubId);

      expect(result).toBe('/import/hub/hub-special_123/preview');
    });
  });
});
