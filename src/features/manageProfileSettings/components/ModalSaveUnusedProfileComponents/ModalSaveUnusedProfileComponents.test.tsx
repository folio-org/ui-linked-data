import { createModalContainer } from '@/test/__mocks__/common/misc/createModalContainer.mock';
import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useManageProfileSettingsState } from '@/store';

import { ModalSaveUnusedProfileComponents } from './ModalSaveUnusedProfileComponents';

const mockNavigate = jest.fn();
const mockSaveSettings = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../hooks/useSaveProfileSettings', () => ({
  useSaveProfileSettings: () => {
    return {
      saveSettings: mockSaveSettings,
    };
  },
}));

describe('ModalSaveUnusedProfileComponents', () => {
  const mockSetIsClosingNext = jest.fn();

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ModalSaveUnusedProfileComponents isOpen={true} setIsOpen={() => {}} />
      </MemoryRouter>,
    );
  };

  beforeAll(() => {
    createModalContainer();
  });

  it('renders modal component', () => {
    renderComponent();

    expect(screen.getByTestId('modal-save-unused-profile-components')).toBeInTheDocument();
  });

  it('takes no action on close', () => {
    renderComponent();

    fireEvent.click(screen.getAllByRole('button')[0]);

    waitFor(() => {
      expect(mockSaveSettings).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('takes no action on cancel', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-cancel'));

    waitFor(() => {
      expect(mockSaveSettings).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('only saves when not closing next', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: false,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    waitFor(() => {
      expect(mockSaveSettings).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('saves and navigates away when closing next', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isClosingNext: true,
          setIsClosingNext: mockSetIsClosingNext,
        },
      },
    ]);

    renderComponent();

    fireEvent.click(screen.getByTestId('modal-button-submit'));

    waitFor(() => {
      expect(mockSaveSettings).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
      expect(mockSetIsClosingNext).toHaveBeenCalledWith(false);
    });
  });
});
