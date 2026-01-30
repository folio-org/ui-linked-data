import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useManageProfileSettingsState } from '@/store';

import { ModalCloseProfileSettings } from './ModalCloseProfileSettings';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('ModalCloseProfileSettings', () => {
  const mockSetSelectedProfile = jest.fn();
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ModalCloseProfileSettings isOpen={true} setIsOpen={() => {}} />
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

  it.skip('when closing view, save and continue saves and sets up view close', () => {
    // TODO: saving not implemented, add test when save exists
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
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    await waitFor(() => {
      expect(mockSetSelectedProfile).toHaveBeenCalled();
    });
  });

  it.skip('when changing profiles, save and continue saves and sets up next profile selection', () => {
    // TODO: saving not implemented, add test when save exists
  });
});
