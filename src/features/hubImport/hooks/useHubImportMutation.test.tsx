import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { getRecordId } from '@/common/helpers/record.helper';

import { useLoadingStateStore, useStatusStore } from '@/store';

import { importHub } from '../api/hubImport.api';
import { useHubImportMutation } from './useHubImportMutation';

jest.mock('@/features/hubImport/api/hubImport.api', () => ({
  ...jest.requireActual('@/features/hubImport/api/hubImport.api'),
  importHub: jest.fn(),
}));
jest.mock('@/common/services/userNotification', () => ({
  UserNotificationFactory: {
    createMessage: jest.fn(),
  },
}));
jest.mock('@/common/helpers/api.helper', () => ({
  getFriendlyErrorMessage: jest.fn((err: Error) => err.message),
}));

const mockNavigateWithState = jest.fn();
jest.mock('@/common/hooks/useNavigateWithSearchState', () => ({
  useNavigateWithSearchState: () => ({
    navigateWithState: mockNavigateWithState,
  }),
}));

jest.mock('@/common/helpers/record.helper', () => ({
  getRecordId: jest.fn(() => 'imported_hub_id'),
}));

describe('useHubImportMutation', () => {
  const setIsLoading = jest.fn();
  const addStatusMessagesItem = jest.fn();
  let queryClient: QueryClient;

  const mockRecord = {
    id: 'imported_hub_id',
    resource: {
      [TYPE_URIS.HUB]: {
        id: 'imported_hub_id',
        label: 'Imported Hub',
      },
    },
  } as unknown as RecordEntry;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
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
        store: useLoadingStateStore,
        state: {
          setIsLoading,
        },
      },
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem,
        },
      },
    ]);

    (importHub as jest.Mock).mockResolvedValue(mockRecord);
  });

  describe('importHubForEdit', () => {
    it('Imports hub and calls importHub with correct URI', async () => {
      const hubId = 'hub_123';

      const { result } = renderHook(() => useHubImportMutation(), { wrapper: createWrapper() });

      await result.current.importHubForEdit(hubId);

      await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));

      expect(importHub).toHaveBeenCalledWith({
        hubUri: 'https://id.loc.gov/resources/hubs/hub_123.json',
      });
    });

    it('Imports hub with specified source', async () => {
      const hubId = 'hub_456';
      const source = 'libraryOfCongress';

      const { result } = renderHook(() => useHubImportMutation(), { wrapper: createWrapper() });

      await result.current.importHubForEdit(hubId, source);

      await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));

      expect(importHub).toHaveBeenCalledWith({
        hubUri: 'https://id.loc.gov/resources/hubs/hub_456.json',
      });
    });

    it('Does not import when hubId is empty', async () => {
      const { result } = renderHook(() => useHubImportMutation(), { wrapper: createWrapper() });

      await result.current.importHubForEdit('');

      expect(importHub).not.toHaveBeenCalled();
    });

    it('Sets loading state to false after import completes', async () => {
      const hubId = 'hub_complete';

      const { result } = renderHook(() => useHubImportMutation(), { wrapper: createWrapper() });

      await result.current.importHubForEdit(hubId);

      await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));

      expect(setIsLoading).toHaveBeenCalledTimes(2); // true, then false
    });

    it('Sets loading state during import', async () => {
      const hubId = 'hub_loading';

      const { result } = renderHook(() => useHubImportMutation(), { wrapper: createWrapper() });

      await result.current.importHubForEdit(hubId);

      await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));

      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    it('Does not navigate when record id is not found', async () => {
      const hubId = 'hub_no_id';
      (getRecordId as jest.Mock).mockReturnValueOnce(null);

      const { result } = renderHook(() => useHubImportMutation(), { wrapper: createWrapper() });

      await result.current.importHubForEdit(hubId);

      await waitFor(() => expect(setIsLoading).toHaveBeenCalledWith(false));

      expect(mockNavigateWithState).not.toHaveBeenCalled();
    });
  });
});
