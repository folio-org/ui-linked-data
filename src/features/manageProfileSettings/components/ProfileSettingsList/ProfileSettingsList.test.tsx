import { setInitialGlobalState } from '@/test/__mocks__/store';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useManageProfileSettingsStore, useUIStore } from '@/store';

import { ProfileSettingsList } from './ProfileSettingsList';

describe('ProfileSettingsList', () => {
  const mockSetIsManageProfileSettingsUnsavedModalOpen = jest.fn();
  const mockSetIsCreating = jest.fn();
  const renderComponent = (modified: boolean) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    queryClient.setQueryData(
      ['profileSettingsMeta', '3'],
      [
        {
          id: 18,
          name: 'eighteen',
        },
        {
          id: 44,
          name: 'forty-four',
        },
      ],
    );
    setInitialGlobalState([
      {
        store: useManageProfileSettingsStore,
        state: {
          selectedProfile: {
            id: 3,
          },
          isModified: modified,
          setIsCreating: mockSetIsCreating,
        },
      },
      {
        store: useUIStore,
        state: {
          setIsManageProfileSettingsUnsavedModalOpen: mockSetIsManageProfileSettingsUnsavedModalOpen,
        },
      },
    ]);

    return render(
      <QueryClientProvider client={queryClient}>
        <ProfileSettingsList />
      </QueryClientProvider>,
    );
  };

  it('renders the component', () => {
    renderComponent(false);

    expect(screen.getByTestId('profile-settings-select-section')).toBeInTheDocument();
  });

  it('opens a confirmation modal when attempting to create while modified', async () => {
    renderComponent(true);

    fireEvent.click(screen.getByTestId('profile-settings-select-create'));

    waitFor(() => {
      expect(mockSetIsManageProfileSettingsUnsavedModalOpen).toHaveBeenCalledWith(true);
      expect(mockSetIsCreating).not.toHaveBeenCalled();
    });
  });

  it('moves to creating mode when attempting to create while not modified', () => {
    renderComponent(false);

    fireEvent.click(screen.getByTestId('profile-settings-select-create'));

    waitFor(() => {
      expect(mockSetIsManageProfileSettingsUnsavedModalOpen).not.toHaveBeenCalled();
      expect(mockSetIsCreating).toHaveBeenCalledWith(true);
    });
  });

  it('does nothing when attempting to edit the placeholder option', () => {
    renderComponent(true);

    fireEvent.change(screen.getByTestId('profile-settings-select'), { target: { value: '44' } });
    fireEvent.change(screen.getByTestId('profile-settings-select'), { target: { value: '' } });

    waitFor(() => {
      expect(mockSetIsManageProfileSettingsUnsavedModalOpen).not.toHaveBeenCalled();
      expect(mockSetIsCreating).not.toHaveBeenCalled();
    });
  });

  it('opens a confirmation modal when attempting to edit while modified', () => {
    renderComponent(true);

    fireEvent.change(screen.getByTestId('profile-settings-select'), { target: { value: '18' } });

    waitFor(() => {
      expect(mockSetIsManageProfileSettingsUnsavedModalOpen).toHaveBeenCalledWith(true);
      expect(mockSetIsCreating).not.toHaveBeenCalled();
    });
  });

  it('moves to editing mode when attempting to edit while not modified', () => {
    renderComponent(false);

    fireEvent.change(screen.getByTestId('profile-settings-select'), { target: { value: '44' } });

    waitFor(() => {
      expect(mockSetIsManageProfileSettingsUnsavedModalOpen).not.toHaveBeenCalled();
      expect(mockSetIsCreating).toHaveBeenCalledWith(false);
    });
  });
});
