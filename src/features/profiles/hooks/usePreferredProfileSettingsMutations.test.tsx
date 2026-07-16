import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import * as profilesApi from '@/common/api/profiles.api';

import { usePreferredProfileSettingsMutations } from './usePreferredProfileSettingsMutations';

jest.mock('@/common/api/profiles.api');

describe('usePreferredProfileSettings', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return Wrapper;
  };

  const mockSavePreferredProfileSettings = profilesApi.savePreferredProfileSettings as jest.MockedFunction<
    typeof profilesApi.savePreferredProfileSettings
  >;
  const mockDeletePreferredProfileSettings = profilesApi.deletePreferredProfileSettings as jest.MockedFunction<
    typeof profilesApi.deletePreferredProfileSettings
  >;

  afterEach(() => {
    queryClient?.clear();
    jest.clearAllMocks();
  });

  describe('updatePreferredProfileSettings', () => {
    it('calls the correct API method', async () => {
      const mockProfileId = 993;
      const mockProfileSettingsId = 21;
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 201 });
      mockSavePreferredProfileSettings.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePreferredProfileSettingsMutations(), {
        wrapper: createWrapper(),
      });
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      result.current.updatePreferredProfileSettings({
        profileId: mockProfileId,
        profileSettingsId: mockProfileSettingsId,
      });

      await waitFor(() => {
        expect(mockSavePreferredProfileSettings).toHaveBeenCalledWith(mockProfileId, mockProfileSettingsId);
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['preferredProfileSettings', String(mockProfileId)] });
      });
    });

    it('handles errors with an error message', async () => {
      // TODO
    });
  });

  describe('removePreferredProfileSettings', () => {
    it('calls the correct API method', async () => {
      const mockProfileId = 744;
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 204 });
      mockDeletePreferredProfileSettings.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePreferredProfileSettingsMutations(), {
        wrapper: createWrapper(),
      });
      const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData');

      result.current.removePreferredProfileSettings({ profileId: mockProfileId });

      await waitFor(() => {
        expect(mockDeletePreferredProfileSettings).toHaveBeenCalledWith(mockProfileId);
        expect(setQueryDataSpy).toHaveBeenCalledWith(['preferredProfileSettings', String(mockProfileId)], []);
      });
    });

    it('handles errors with an error message', async () => {
      // TODO
    });
  });
});
