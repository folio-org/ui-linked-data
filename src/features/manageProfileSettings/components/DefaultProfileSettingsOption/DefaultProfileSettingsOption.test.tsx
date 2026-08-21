import { setInitialGlobalState } from '@/test/__mocks__/store';

import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { fetchPreferredProfileSettings } from '@/common/api/profiles.api';
import { PROFILE_SETTINGS_DEFAULT_OPTION } from '@/common/constants/profileSettings.constants';

import { useManageProfileSettingsState } from '@/store';

import { DefaultProfileSettingsOption } from './DefaultProfileSettingsOption';

jest.mock('@/common/api/profiles.api', () => ({
  fetchPreferredProfileSettings: jest.fn(),
}));

describe('DefaultProfileSettingsOption', () => {
  const mockSetIsModified = jest.fn();

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

  const mockProfileId = 3;
  const mockProfileSettingsId = 24;
  const mockPreferredProfileSettings = [
    {
      id: mockProfileSettingsId,
      profileId: mockProfileId,
      name: 'mock settings',
    },
  ];
  const mockAlternatePreferredProfileSettings = [
    {
      id: 52,
      profileId: mockProfileId,
      name: 'alternate settings',
    },
  ];

  const renderComponent = (profileId: string | number | null, profileSettingsId: string | number) => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          setIsModified: mockSetIsModified,
        },
      },
    ]);

    return render(
      <MemoryRouter>
        <DefaultProfileSettingsOption selectedProfileId={profileId} selectedProfileSettingsId={profileSettingsId} />
      </MemoryRouter>,
      { wrapper: createWrapper() },
    );
  };

  afterEach(() => {
    queryClient?.clear();
    jest.clearAllMocks();
  });

  it('checked when current profile settings match preferred profile settings', async () => {
    (fetchPreferredProfileSettings as jest.Mock).mockReturnValue(mockPreferredProfileSettings);

    renderComponent(mockProfileId, mockProfileSettingsId);

    await waitFor(() => {
      expect(screen.getByTestId('default-profile-settings-control')).toBeChecked();
    });
  });

  it('disabled when profile is undefined', async () => {
    (fetchPreferredProfileSettings as jest.Mock).mockReturnValue(mockPreferredProfileSettings);

    renderComponent(null, PROFILE_SETTINGS_DEFAULT_OPTION);

    await waitFor(() => {
      expect(screen.getByTestId('default-profile-settings-control')).toBeDisabled();
    });
  });

  it('unchecked when selected profile settings is not preferred', async () => {
    (fetchPreferredProfileSettings as jest.Mock).mockReturnValue(mockAlternatePreferredProfileSettings);

    renderComponent(mockProfileId, mockProfileSettingsId);

    await waitFor(() => {
      expect(screen.getByTestId('default-profile-settings-control')).not.toBeChecked();
    });
  });

  it('unchecked when no preferred profle settings', async () => {
    (fetchPreferredProfileSettings as jest.Mock).mockReturnValue([]);

    renderComponent(mockProfileId, mockProfileSettingsId);

    await waitFor(() => {
      expect(screen.getByTestId('default-profile-settings-control')).not.toBeChecked();
    });
  });

  it('updates preferred value through interaction', async () => {
    (fetchPreferredProfileSettings as jest.Mock).mockReturnValue(mockPreferredProfileSettings);

    renderComponent(mockProfileId, mockProfileSettingsId);

    await waitFor(() => {
      expect(screen.getByTestId('default-profile-settings-control')).toBeChecked();
    });

    fireEvent.click(screen.getByTestId('default-profile-settings-control'));

    await waitFor(() => {
      expect(mockSetIsModified).toHaveBeenCalledWith(true);
      expect(screen.getByTestId('default-profile-settings-control')).not.toBeChecked();
    });
  });
});
