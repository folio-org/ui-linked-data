import { setInitialGlobalState, setUpdatedGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { fetchProfile } from '@/common/api/profiles.api';
import { StatusType } from '@/common/constants/status.constants';

import { useLoadProfileSettings } from '@/features/profiles';

import { useLoadingState, useManageProfileSettingsState, useStatusStore } from '@/store';

import { ProfileSettings } from './ProfileSettings';

// Settle promise chains of any depth before asserting.
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

jest.mock('@/common/api/profiles.api', () => ({
  fetchPreferredProfiles: jest.fn(),
  fetchProfile: jest.fn(),
  fetchProfileSettings: jest.fn(),
}));
jest.mock('@/features/profiles', () => ({
  ...jest.requireActual('@/features/profiles'),
  useLoadProfileSettings: jest.fn(),
}));
jest.mock('../DefaultProfileOption', () => ({
  DefaultProfileOption: () => <div data-testid="default-profile-option" />,
}));
jest.mock('../ProfileSettingsEditor', () => ({
  ProfileSettingsEditor: () => <div data-testid="profile-settings-editor" />,
}));

const mockWorkResourceTypeUrl = 'mock-work-resource-type-url';

describe('ProfileSettings', () => {
  const mockAddStatusMessagesItem = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockLoadProfileSettings = jest.fn();
  const mockResetProfileSettings = jest.fn();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    queryClient.clear();
    (fetchProfile as jest.Mock).mockResolvedValue([]);
    (useLoadProfileSettings as jest.Mock).mockReturnValue({
      loadProfileSettings: mockLoadProfileSettings,
    });
    mockLoadProfileSettings.mockResolvedValue({
      active: true,
      children: [],
      missingFromSettings: [],
    });
  });

  const renderComponent = (selected: boolean, defaultMeta: boolean) => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          selectedProfile: selected
            ? {
                id: 'one',
                name: 'One',
                resourceType: mockWorkResourceTypeUrl,
              }
            : null,
          selectedProfileSettingsMeta: {
            id: defaultMeta ? 'default' : 'meta-one',
          },
          resetProfileSettings: mockResetProfileSettings,
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
    renderComponent(false, false);

    expect(screen.queryByTestId('profile-settings')).not.toBeInTheDocument();
  });

  it('renders when profile selected', () => {
    renderComponent(true, false);

    expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
  });

  it('shows an error when loading profile fails', async () => {
    const error = new Error('Failed to load profile');
    (fetchProfile as jest.Mock).mockRejectedValue(error);

    renderComponent(true, false);

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
    (fetchProfile as jest.Mock).mockResolvedValue([]);
    mockLoadProfileSettings.mockRejectedValue(error);

    renderComponent(true, false);

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

  it('passes the selected profile resource type URI to load profile settings', async () => {
    const profile = [] as Profile;
    (fetchProfile as jest.Mock).mockResolvedValue(profile);

    renderComponent(true, false);

    await waitFor(() => {
      expect(mockLoadProfileSettings).toHaveBeenCalledWith('meta-one', 'one', profile, mockWorkResourceTypeUrl);
    });
  });

  it('resets profile settings if settings ID is set to default', async () => {
    renderComponent(true, true);

    await waitFor(() => {
      expect(mockResetProfileSettings).toHaveBeenCalled();
    });
  });

  describe('cancellation of stale async work', () => {
    it('applies the profile and settings load when nothing changes before it resolves', async () => {
      const profile = [{ id: 'node' }] as unknown as Profile;
      const settings = { active: true, children: [], missingFromSettings: [] };
      (fetchProfile as jest.Mock).mockResolvedValue(profile);
      mockLoadProfileSettings.mockResolvedValue(settings);

      renderComponent(true, false);

      await waitFor(() => {
        expect(useManageProfileSettingsState.getState().fullProfile).toEqual(profile);
        expect(useManageProfileSettingsState.getState().profileSettings).toEqual(settings);
      });
      expect(mockSetIsLoading).toHaveBeenLastCalledWith(false);
    });

    it('ignores a stale profile load that resolves after the selected profile changes again', async () => {
      const deferredOne = createDeferred<Profile>();
      const deferredTwo = createDeferred<Profile>();
      const profileOne = [{ id: 'stale-profile' }] as unknown as Profile;
      const profileTwo = [{ id: 'fresh-profile' }] as unknown as Profile;

      (fetchProfile as jest.Mock).mockImplementation((id: string) =>
        id === 'one' ? deferredOne.promise : deferredTwo.promise,
      );

      renderComponent(true, false);

      await waitFor(() => {
        expect(fetchProfile).toHaveBeenCalledWith('one');
      });

      // the user selects a different profile before the first request resolves
      act(() => {
        setUpdatedGlobalState([
          {
            store: useManageProfileSettingsState,
            updatedState: {
              selectedProfile: { id: 'two', name: 'Two', resourceType: mockWorkResourceTypeUrl },
            },
          },
        ]);
      });

      await waitFor(() => {
        expect(fetchProfile).toHaveBeenCalledWith('two');
      });

      // the current request resolves first
      await act(async () => {
        deferredTwo.resolve(profileTwo);
        await flushPromises();
      });
      expect(useManageProfileSettingsState.getState().fullProfile).toEqual(profileTwo);

      // the stale request resolves afterwards and must not overwrite the current profile
      await act(async () => {
        deferredOne.resolve(profileOne);
        await flushPromises();
      });
      expect(useManageProfileSettingsState.getState().fullProfile).toEqual(profileTwo);
    });

    it('ignores a stale profile settings load that resolves after the settings selection changes again', async () => {
      (fetchProfile as jest.Mock).mockResolvedValue([]);

      const deferredMetaOne = createDeferred<ProfileSettingsWithDrift>();
      const deferredMetaTwo = createDeferred<ProfileSettingsWithDrift>();
      const settingsOne = {
        active: true,
        children: [{ id: 'stale', visible: true, order: 1 }],
        missingFromSettings: [],
      };
      const settingsTwo = {
        active: true,
        children: [{ id: 'fresh', visible: true, order: 1 }],
        missingFromSettings: [],
      };

      mockLoadProfileSettings.mockImplementation((metaId: string) =>
        metaId === 'meta-one' ? deferredMetaOne.promise : deferredMetaTwo.promise,
      );

      renderComponent(true, false);

      await waitFor(() => {
        expect(mockLoadProfileSettings).toHaveBeenCalledWith('meta-one', 'one', [], mockWorkResourceTypeUrl);
      });

      // the user selects a different settings option before the first request resolves
      act(() => {
        setUpdatedGlobalState([
          {
            store: useManageProfileSettingsState,
            updatedState: { selectedProfileSettingsMeta: { id: 'meta-two', profileId: 'one', name: 'meta-two' } },
          },
        ]);
      });

      await waitFor(() => {
        expect(mockLoadProfileSettings).toHaveBeenCalledWith('meta-two', 'one', [], mockWorkResourceTypeUrl);
      });

      // the current request resolves first
      await act(async () => {
        deferredMetaTwo.resolve(settingsTwo);
        await flushPromises();
      });
      expect(useManageProfileSettingsState.getState().profileSettings).toEqual(settingsTwo);

      // the stale request resolves afterwards and must not overwrite the current settings
      await act(async () => {
        deferredMetaOne.resolve(settingsOne);
        await flushPromises();
      });
      expect(useManageProfileSettingsState.getState().profileSettings).toEqual(settingsTwo);
    });

    it('does not update the store or show an error for a stale, failed profile load', async () => {
      const deferredOne = createDeferred<Profile>();
      const deferredTwo = createDeferred<Profile>();
      const profileTwo = [{ id: 'fresh-profile' }] as unknown as Profile;

      (fetchProfile as jest.Mock).mockImplementation((id: string) =>
        id === 'one' ? deferredOne.promise : deferredTwo.promise,
      );

      renderComponent(true, false);

      await waitFor(() => {
        expect(fetchProfile).toHaveBeenCalledWith('one');
      });

      act(() => {
        setUpdatedGlobalState([
          {
            store: useManageProfileSettingsState,
            updatedState: {
              selectedProfile: { id: 'two', name: 'Two', resourceType: mockWorkResourceTypeUrl },
            },
          },
        ]);
      });

      await waitFor(() => {
        expect(fetchProfile).toHaveBeenCalledWith('two');
      });

      await act(async () => {
        deferredTwo.resolve(profileTwo);
        await flushPromises();
      });
      expect(useManageProfileSettingsState.getState().fullProfile).toEqual(profileTwo);

      // the stale request fails after being superseded; it must not surface an error or clear loading state
      mockAddStatusMessagesItem.mockClear();
      mockSetIsLoading.mockClear();
      await act(async () => {
        deferredOne.reject(new Error('stale profile load failed'));
        await flushPromises();
      });

      expect(mockAddStatusMessagesItem).not.toHaveBeenCalled();
      expect(mockSetIsLoading).not.toHaveBeenCalled();
      expect(useManageProfileSettingsState.getState().fullProfile).toEqual(profileTwo);
    });
  });

  describe('accessibility', () => {
    test.each([
      ['selected profile missing', false, false],
      ['profile selected', true, false],
    ])('has no accessibility violations when %s', async (_description, selected, defaultMeta) => {
      const { container } = renderComponent(selected, defaultMeta);

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
