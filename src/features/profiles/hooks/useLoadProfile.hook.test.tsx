import '@/test/__mocks__/common/hooks/useServicesContext.mock';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { fetchProfile } from '@/common/api/profiles.api';

import { PROFILE_QUERY_KEY, useLoadProfile } from './useLoadProfile';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfile: jest.fn(),
}));

describe('useLoadProfile', () => {
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

  describe('loadProfile', () => {
    test('returns cached profile when it exists in query cache', async () => {
      const cachedProfile = { id: 'cached-profile' };
      const wrapper = createWrapper();
      queryClient.setQueryData([PROFILE_QUERY_KEY, '1'], cachedProfile);

      const { result } = renderHook(useLoadProfile, { wrapper });
      const profile = await result.current.loadProfile(1);

      expect(profile).toBe(cachedProfile);
      expect(fetchProfile).not.toHaveBeenCalled();
    });

    test('fetches and caches profile when it does not exist', async () => {
      const newProfile = { id: 'new-profile' };
      (fetchProfile as jest.Mock).mockResolvedValue(newProfile);

      const { result } = renderHook(useLoadProfile, { wrapper: createWrapper() });
      const profile = await result.current.loadProfile(1);

      expect(profile).toBe(newProfile);
      expect(fetchProfile).toHaveBeenCalledWith(1);

      // Verify it's cached in query client
      const cached = queryClient.getQueryData([PROFILE_QUERY_KEY, '1']);
      expect(cached).toBe(newProfile);
    });

    test('handles error from fetchProfile', async () => {
      const error = new Error('Failed to fetch profile');
      (fetchProfile as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(useLoadProfile, { wrapper: createWrapper() });

      await expect(result.current.loadProfile(1)).rejects.toThrow('Failed to fetch profile');
      expect(fetchProfile).toHaveBeenCalledWith(1);
    });

    test('deduplicates concurrent requests for the same profile', async () => {
      const newProfile = { id: 'deduped-profile' };
      (fetchProfile as jest.Mock).mockResolvedValue(newProfile);

      const { result } = renderHook(useLoadProfile, { wrapper: createWrapper() });

      const [profile1, profile2] = await Promise.all([result.current.loadProfile(1), result.current.loadProfile(1)]);

      expect(profile1).toBe(newProfile);
      expect(profile2).toBe(newProfile);
      expect(fetchProfile).toHaveBeenCalledTimes(1);
    });
  });
});
