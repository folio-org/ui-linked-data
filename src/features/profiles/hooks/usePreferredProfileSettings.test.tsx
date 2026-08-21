import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import * as profilesApi from '@/common/api/profiles.api';

import { usePreferredProfileSettings } from './usePreferredProfileSettings';

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

  const mockFetchPreferredProfileSettings = profilesApi.fetchPreferredProfileSettings as jest.MockedFunction<
    typeof profilesApi.fetchPreferredProfileSettings
  >;

  afterEach(() => {
    queryClient?.clear();
  });

  describe('loadPreferredProfileSettings', () => {
    it('returns the preferred profile settings for a given profile', async () => {
      const mockProfileId = 3;
      const mockResult = [
        {
          id: 25,
          profileId: mockProfileId,
          name: 'settings name',
        },
      ];
      mockFetchPreferredProfileSettings.mockResolvedValue(mockResult);

      const { result } = renderHook(() => usePreferredProfileSettings(mockProfileId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchPreferredProfileSettings).toHaveBeenCalledWith(mockProfileId);
        expect(result.current.data).toEqual(mockResult);
      });
    });

    it('does not fetch when profile ID is null', async () => {
      const { result } = renderHook(() => usePreferredProfileSettings(null), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetchPreferredProfileSettings).not.toHaveBeenCalled();
        expect(result.current.data).toBeUndefined();
      });
    });
  });
});
