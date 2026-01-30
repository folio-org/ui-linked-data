import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { fetchProfile, fetchProfileSettings } from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';

import { useLoadingState, useManageProfileSettingsState, useStatusStore } from '@/store';

import { ProfileSettings } from './ProfileSettings';

jest.mock('@/common/api/profiles.api', () => ({
  fetchPreferredProfiles: jest.fn(),
  fetchProfile: jest.fn(),
  fetchProfileSettings: jest.fn(),
}));

describe('ProfileSettings', () => {
  const mockAddStatusMessagesItem = jest.fn();
  const mockSetIsLoading = jest.fn();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderComponent = (selected: boolean) => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          selectedProfile: selected
            ? {
                id: 'one',
                name: 'One',
                resourceType: 'test-resource',
              }
            : null,
        },
      },
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem: mockAddStatusMessagesItem,
        },
      },
      {
        store: useLoadingState,
        state: {
          setIsLoading: mockSetIsLoading,
        },
      },
    ]);

    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ProfileSettings />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  it('does not render if selected profile is missing', async () => {
    renderComponent(false);

    expect(screen.queryByTestId('profile-settings')).not.toBeInTheDocument();
  });

  it('renders when profile selected', () => {
    renderComponent(true);

    expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
  });

  it('shows an error when loading profile fails', async () => {
    const error = new Error('Failed to load profile');
    (fetchProfile as jest.Mock).mockRejectedValue(error);

    renderComponent(true);

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockAddStatusMessagesItem).toHaveBeenCalledWith(
        expect.objectContaining({
          type: StatusType.error,
        }),
      );
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  it('shows an error when loading profile settings fails', async () => {
    const error = new Error('Failed to load profile settings');
    (fetchProfile as jest.Mock).mockResolvedValue({});
    (fetchProfileSettings as jest.Mock).mockRejectedValue(error);

    renderComponent(true);

    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockAddStatusMessagesItem).toHaveBeenCalledWith(
        expect.objectContaining({
          type: StatusType.error,
        }),
      );
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });
});
