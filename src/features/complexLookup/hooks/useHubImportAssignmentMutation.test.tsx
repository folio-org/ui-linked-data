import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import * as hubApi from '@/common/api/hub.api';
import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import * as recordHelper from '@/common/helpers/record.helper';

import { useHubImportAssignmentMutation } from './useHubImportAssignmentMutation';

jest.mock('@/common/api/hub.api');
jest.mock('@/common/helpers/record.helper');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useHubImportAssignmentMutation', () => {
  const mockImportHub = hubApi.importHub as jest.MockedFunction<typeof hubApi.importHub>;
  const mockNormalizeExternalHubUri = hubApi.normalizeExternalHubUri as jest.MockedFunction<
    typeof hubApi.normalizeExternalHubUri
  >;
  const mockGetRecordId = recordHelper.getRecordId as jest.MockedFunction<typeof recordHelper.getRecordId>;

  describe('importForAssignment', () => {
    it('normalizes URI and imports hub successfully', async () => {
      const mockRecord = { resource: { hub: { id: 'imported_id_1' } } };
      mockNormalizeExternalHubUri.mockReturnValue('https://example.com/hub1.json');
      mockImportHub.mockResolvedValue(mockRecord as RecordEntry);
      mockGetRecordId.mockReturnValue('imported_id_1');

      const { result } = renderHook(() => useHubImportAssignmentMutation(), {
        wrapper: createWrapper(),
      });

      const importPromise = result.current.importForAssignment({ hubUri: 'http://example.com/hub1' });

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      const importResult = await importPromise;

      expect(mockNormalizeExternalHubUri).toHaveBeenCalledWith('http://example.com/hub1');
      expect(mockImportHub).toHaveBeenCalledWith({ hubUri: 'https://example.com/hub1.json' });
      expect(mockGetRecordId).toHaveBeenCalledWith(mockRecord, TYPE_URIS.HUB);
      expect(importResult).toEqual({ importedId: 'imported_id_1' });
    });

    it('throws error when import returns no id', async () => {
      const mockRecord = { resource: { hub: {} } };
      mockNormalizeExternalHubUri.mockReturnValue('https://example.com/hub2.json');
      mockImportHub.mockResolvedValue(mockRecord as RecordEntry);
      mockGetRecordId.mockReturnValue(undefined);

      const { result } = renderHook(() => useHubImportAssignmentMutation(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.importForAssignment({ hubUri: 'http://example.com/hub2' })).rejects.toThrow(
        'Hub import returned no id',
      );
    });

    it('propagates import API errors', async () => {
      const apiError = new Error('Network error');
      mockNormalizeExternalHubUri.mockReturnValue('https://example.com/hub3.json');
      mockImportHub.mockRejectedValue(apiError);

      const { result } = renderHook(() => useHubImportAssignmentMutation(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.importForAssignment({ hubUri: 'http://example.com/hub3' })).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('mutation state', () => {
    it('sets isPending to true during mutation', async () => {
      const mockRecord = { resource: { hub: { id: 'hub_id_1' } } };
      mockNormalizeExternalHubUri.mockReturnValue('https://example.com/hub.json');
      mockImportHub.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockRecord as RecordEntry), 100)),
      );
      mockGetRecordId.mockReturnValue('hub_id_1');

      const { result } = renderHook(() => useHubImportAssignmentMutation(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      const importPromise = result.current.importForAssignment({ hubUri: 'http://example.com/hub' });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      await importPromise;

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });

    it('sets isError to true on failure', async () => {
      mockNormalizeExternalHubUri.mockReturnValue('https://example.com/hub.json');
      mockImportHub.mockRejectedValue(new Error('Import failed'));

      const { result } = renderHook(() => useHubImportAssignmentMutation(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.importForAssignment({ hubUri: 'http://example.com/hub' });
      } catch {
        // Expected error
      }

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(new Error('Import failed'));
      });
    });

    it('resets mutation state using reset function', async () => {
      mockNormalizeExternalHubUri.mockReturnValue('https://example.com/hub.json');
      mockImportHub.mockRejectedValue(new Error('Import failed'));

      const { result } = renderHook(() => useHubImportAssignmentMutation(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.importForAssignment({ hubUri: 'http://example.com/hub' });
      } catch {
        // Expected error
      }

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      result.current.reset();

      await waitFor(() => {
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });
  });
});
