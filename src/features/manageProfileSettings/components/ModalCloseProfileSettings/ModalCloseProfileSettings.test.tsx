import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ProfileSettingsMode } from '@/common/constants/profileSettings.constants';

import { useManageProfileSettingsState, useUIState } from '@/store';

import { ModalCloseProfileSettings } from './ModalCloseProfileSettings';

const mockUseNavigate = jest.fn();
const mockSetIsManageProfileSettingsShowProfiles = jest.fn();
const mockSetIsManageProfileSettingsShowEditor = jest.fn();
const mockSaveSettings = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

jest.mock('../../hooks/useSaveProfileSettings', () => ({
  useSaveProfileSettings: () => {
    return {
      saveSettings: mockSaveSettings,
    };
  },
}));

describe('ModalCloseProfileSettings', () => {
  const mockSetSelectedProfile = jest.fn();
  const mockSetMode = jest.fn();
  const mockSetSelectedProfileSettingsMeta = jest.fn();
  const mockSetIsPreferredProfileSettings = jest.fn();
  const mockSetSettingsName = jest.fn();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ModalCloseProfileSettings isOpen={true} setIsOpen={() => {}} />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  beforeAll(() => {
    createModalContainer();
  });

  it('renders modal component', () => {
    renderComponent();

    expect(screen.getByTestId('modal-close-profile-settings')).toBeInTheDocument();
  });

  it('renders modal component with component warning when not in landing mode', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          mode: ProfileSettingsMode.Editing,
        },
      },
    ]);

    renderComponent();

    expect(screen.getByTestId('modal-close-profile-settings')).toBeInTheDocument();
    expect(screen.getByText('ld.unsavedProfileNote')).toBeInTheDocument();
  });

  it('renders modal component without component warning when in landing mode', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          mode: ProfileSettingsMode.Landing,
        },
      },
    ]);

    renderComponent();

    expect(screen.getByTestId('modal-close-profile-settings')).toBeInTheDocument();
    expect(screen.queryByText('ld.unsavedProfileNote')).not.toBeInTheDocument();
  });

  it('when closing modal, do not save or navigate', async () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText('ld.aria.modal.close'));

    await waitFor(() => {
      expect(mockUseNavigate).not.toHaveBeenCalled();
      expect(mockSaveSettings).not.toHaveBeenCalled();
    });
  });

  it('when closing view, continue without saving sets up view close', async () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: true,
          nextSelectedProfile: null,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalled();
    });
  });

  it('when closing view, save and continue saves and sets up view close', async () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: true,
          nextSelectedProfile: null,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(mockUseNavigate).toHaveBeenCalled();
      expect(mockSaveSettings).toHaveBeenCalled();
    });
  });

  it('when changing profiles, continue without saving sets up next profile selection', async () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: false,
          nextSelectedProfile: {
            id: 'test-profile',
            name: 'Test Profile',
            resourceTypeURL: 'test-resource',
          },
          setSelectedProfile: mockSetSelectedProfile,
          setMode: mockSetMode,
        },
      },
      {
        store: useUIState,
        state: {
          setIsManageProfileSettingsShowEditor: mockSetIsManageProfileSettingsShowEditor,
          setIsManageProfileSettingsShowProfiles: mockSetIsManageProfileSettingsShowProfiles,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    await waitFor(() => {
      expect(mockSetSelectedProfile).toHaveBeenCalled();
      expect(mockSetIsManageProfileSettingsShowEditor).toHaveBeenCalledWith(true);
      expect(mockSetIsManageProfileSettingsShowProfiles).toHaveBeenCalledWith(false);
      expect(mockSetMode).toHaveBeenCalledWith(ProfileSettingsMode.Landing);
    });
  });

  it('when changing profiles, save and continue saves and sets up next profile selection', async () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: false,
          nextSelectedProfile: {
            id: 'test-profile',
            name: 'Test Profile',
            resourceTypeURL: 'test-resource',
          },
          setSelectedProfile: mockSetSelectedProfile,
        },
      },
      {
        store: useUIState,
        state: {
          setIsManageProfileSettingsShowEditor: mockSetIsManageProfileSettingsShowEditor,
          setIsManageProfileSettingsShowProfiles: mockSetIsManageProfileSettingsShowProfiles,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(mockSaveSettings).toHaveBeenCalled();
      expect(mockSetSelectedProfile).toHaveBeenCalled();
      expect(mockSetIsManageProfileSettingsShowEditor).toHaveBeenCalledWith(true);
      expect(mockSetIsManageProfileSettingsShowProfiles).toHaveBeenCalledWith(false);
    });
  });

  it('when creating new settings next, move to creating mode with no settings meta selected', async () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: false,
          nextSelectedProfile: null,
          isCreatingSettingsNext: true,
          setMode: mockSetMode,
          setSelectedProfileSettingsMeta: mockSetSelectedProfileSettingsMeta,
          setIsPreferredProfileSettings: mockSetIsPreferredProfileSettings,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(mockSetMode).toHaveBeenCalledWith(ProfileSettingsMode.Creating);
      expect(mockSetSelectedProfileSettingsMeta).toHaveBeenCalledWith(null);
      expect(mockSetIsPreferredProfileSettings).toHaveBeenCalledWith(false);
    });
  });

  it('when editing existing settings next, move to editing mode with next settings meta selected ', async () => {
    const settingsMeta = { id: 'meta', name: 'edit-name' };
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: false,
          nextSelectedProfile: null,
          isCreatingSettingsNext: false,
          isEditingSettingsNext: true,
          nextSelectedSettingsMeta: settingsMeta,
          setMode: mockSetMode,
          setSelectedProfileSettingsMeta: mockSetSelectedProfileSettingsMeta,
          setSettingsName: mockSetSettingsName,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    await waitFor(() => {
      expect(mockSetMode).toHaveBeenCalledWith(ProfileSettingsMode.Editing);
      expect(mockSetSelectedProfileSettingsMeta).toHaveBeenCalledWith(settingsMeta);
      expect(mockSetSettingsName).toHaveBeenCalledWith('edit-name');
    });
  });

  describe('accessibility', () => {
    test.each([
      ['default state', () => {}],
      [
        'not in landing mode',
        () =>
          setInitialGlobalState([
            {
              store: useManageProfileSettingsState,
              state: { mode: ProfileSettingsMode.Editing },
            },
          ]),
      ],
      [
        'in landing mode',
        () =>
          setInitialGlobalState([
            {
              store: useManageProfileSettingsState,
              state: { mode: ProfileSettingsMode.Landing },
            },
          ]),
      ],
    ])('has no accessibility violations when %s', async (_description, setup) => {
      setup();

      const { container } = renderComponent();

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });
});
