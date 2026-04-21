import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { fetchProfiles } from '@/common/api/profiles.api';
import { TYPE_URIS } from '@/common/constants/bibframe.constants';
import { StatusType } from '@/common/constants/status.constants';

import { useManageProfileSettingsState, useProfileState, useStatusStore, useUIState } from '@/store';

import { ProfilesList } from './ProfilesList';

jest.mock('@/common/api/profiles.api', () => ({
  fetchProfiles: jest.fn(),
}));

describe('ProfilesList', () => {
  const mockSetIsManageProfileSettingsUnsavedModalOpen = jest.fn();
  const mockAddStatusMessagesItem = jest.fn();

  const renderComponent = (presetProfiles: boolean, isModified: boolean, fetchProfileError: boolean) => {
    setInitialGlobalState([
      {
        store: useProfileState,
        state: {
          availableProfiles: presetProfiles
            ? {
                [TYPE_URIS.WORK as ResourceTypeURL]: [
                  {
                    id: 'one-work-profile',
                    name: 'One Work Profile',
                    resourceTypeURL: TYPE_URIS.WORK,
                  },
                ],
                [TYPE_URIS.INSTANCE as ResourceTypeURL]: [
                  {
                    id: 'one-instance-profile',
                    name: 'One Instance Profile',
                    resourceTypeURL: TYPE_URIS.INSTANCE,
                  },
                ],
              }
            : null,
        },
      },
      {
        store: useManageProfileSettingsState,
        state: {
          selectedProfile: null,
          isModified: isModified,
        },
      },
      {
        store: useUIState,
        state: {
          setIsManageProfileSettingsUnsavedModalOpen: mockSetIsManageProfileSettingsUnsavedModalOpen,
        },
      },
      {
        store: useStatusStore,
        state: {
          addStatusMessagesItem: mockAddStatusMessagesItem,
        },
      },
    ]);

    if (fetchProfileError) {
      const error = new Error('Failed to load profiles');
      (fetchProfiles as jest.Mock).mockRejectedValue(error);
    } else {
      (fetchProfiles as jest.Mock).mockResolvedValue([]);
    }

    return render(
      <MemoryRouter>
        <ProfilesList />
      </MemoryRouter>,
    );
  };

  it('renders the component', () => {
    renderComponent(true, false, false);

    expect(screen.getByTestId('profiles-list')).toBeInTheDocument();
  });

  it('renders with pre-set profiles', () => {
    renderComponent(true, false, false);

    expect(screen.getByText('One Work Profile')).toBeInTheDocument();
    expect(screen.getByText('One Instance Profile')).toBeInTheDocument();
  });

  it('auto-selects first profile as default profile', () => {
    renderComponent(true, false, false);

    const firstProfile = screen.getByRole('button', { name: 'One Work Profile' });
    expect(firstProfile.parentElement).toHaveClass('selected');
  });

  it('shows an error when profiles cannot be loaded', async () => {
    renderComponent(false, false, true);

    await waitFor(() => {
      expect(mockAddStatusMessagesItem).toHaveBeenCalledWith(
        expect.objectContaining({
          type: StatusType.error,
        }),
      );
    });
  });

  it('selects a new profile immediately when unmodified without modal', () => {
    renderComponent(true, false, false);

    const instanceProfile = screen.getByRole('button', { name: 'One Instance Profile' });
    fireEvent.click(instanceProfile);

    expect(instanceProfile.parentElement).toHaveClass('selected');
    expect(mockSetIsManageProfileSettingsUnsavedModalOpen).not.toHaveBeenCalled();
  });

  it('selecting a profile opens a confirmation modal if modified', () => {
    renderComponent(true, true, false);

    const instanceProfile = screen.getByRole('button', { name: 'One Instance Profile' });
    fireEvent.click(instanceProfile);

    const workProfile = screen.getByRole('button', { name: 'One Work Profile' });
    expect(workProfile.parentElement).toHaveClass('selected');
    expect(mockSetIsManageProfileSettingsUnsavedModalOpen).toHaveBeenCalledWith(true);
  });
});
