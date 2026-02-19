import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useManageProfileSettingsState, useUIState } from '@/store';

import { ModalCloseProfileSettings } from './ModalCloseProfileSettings';

const mockUseNavigate = jest.fn();
const mockSetIsManageProfileSettingsShowProfiles = jest.fn();
const mockSetIsManageProfileSettingsShowEditor = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('ModalCloseProfileSettings', () => {
  const mockSetSelectedProfile = jest.fn();
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

  it('when closing view, save and continue saves and sets up view close', () => {});

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
    });
  });

  it('when changing profiles, save and continue saves and sets up next profile selection', () => {});
});
