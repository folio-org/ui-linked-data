import '@/test/__mocks__/common/hooks/useSchemaPipeline.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { fetchAllSettingsForProfile } from '@/common/api/profiles.api';

import { useStatusState } from '@/store';

import { useLoadProfileSettingsMeta } from './useLoadProfileSettingsMeta';

jest.mock('@/common/api/profiles.api', () => ({
  fetchAllSettingsForProfile: jest.fn(),
}));

describe('useLoadProfileSettingsMeta', () => {
  const addStatusMessagesItem = jest.fn();
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

  beforeEach(() => {
    setInitialGlobalState([
      {
        store: useStatusState,
        state: {
          addStatusMessagesItem,
        },
      },
    ]);
  });

  afterEach(() => {
    queryClient?.clear();
  });

  describe('loadProfileSettingsMeta', () => {
    test('does not run when null profile ID provided', async () => {
      renderHook(() => useLoadProfileSettingsMeta(null), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(fetchAllSettingsForProfile).not.toHaveBeenCalled();
      });
    });

    test('fetches profile settings meta', async () => {
      const settingsMeta = [
        {
          id: 20,
          name: 'twenty',
        },
      ];
      (fetchAllSettingsForProfile as jest.Mock).mockResolvedValue(settingsMeta);

      const { result } = renderHook(() => useLoadProfileSettingsMeta(10), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(fetchAllSettingsForProfile).toHaveBeenCalledWith(10);
        expect(result.current.data).toBe(settingsMeta);
      });
    });

    test('error in fetchAllSettingsForProfile displays an error notification', async () => {
      (fetchAllSettingsForProfile as jest.Mock).mockRejectedValue('error');

      renderHook(() => useLoadProfileSettingsMeta(1), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(fetchAllSettingsForProfile).toHaveBeenCalledWith(1);
        expect(addStatusMessagesItem).toHaveBeenCalled();
      });
    });
  });
});
