import { setInitialGlobalState } from '@/test/__mocks__/store';

import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useManageProfileSettingsState, useUIState } from '@/store';

import { ManageProfileSettingsControls } from './ManageProfileSettingsControls';

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

describe('ManageProfileSettingsControls', () => {
  const mockSetIsManageProfileSettingsUnusedComponentsModalOpen = jest.fn();
  const mockSetIsClosingNext = jest.fn();

  const renderComponent = (isModified: boolean, hasUnused: boolean) => {
    let unused = [] as ProfileSettingComponent[];
    if (hasUnused) {
      unused = [
        {
          id: 'unused-1',
          name: 'Unused',
          mandatory: false,
        },
      ];
    }
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          unusedComponents: unused,
          isModified: isModified,
          setIsClosingNext: mockSetIsClosingNext,
        },
      },
      {
        store: useUIState,
        state: {
          setIsManageProfileSettingsUnusedComponentsModalOpen: mockSetIsManageProfileSettingsUnusedComponentsModalOpen,
        },
      },
    ]);

    return render(
      <MemoryRouter>
        <ManageProfileSettingsControls />
      </MemoryRouter>,
    );
  };

  it('renders the pane', () => {
    renderComponent(false, false);

    expect(screen.getByTestId('manage-profile-settings-controls')).toBeInTheDocument();
  });

  it('save buttons are disabled when no modifications exist', () => {
    renderComponent(false, false);

    expect(screen.getByTestId('save-and-close')).toBeDisabled();
    expect(screen.getByTestId('save-and-keep-editing')).toBeDisabled();
  });

  it('save buttons are enabled when modifications exist', () => {
    renderComponent(true, false);

    expect(screen.getByTestId('save-and-close')).toBeEnabled();
    expect(screen.getByTestId('save-and-keep-editing')).toBeEnabled();
  });

  it('save and continue with unused components opens modal', () => {
    renderComponent(true, true);

    fireEvent.click(screen.getByTestId('save-and-keep-editing'));

    waitFor(() => {
      expect(mockSetIsManageProfileSettingsUnusedComponentsModalOpen).toHaveBeenCalled();
    });
  });

  it('save and continue without unused components saves', () => {
    renderComponent(true, false);

    fireEvent.click(screen.getByTestId('save-and-keep-editing'));

    waitFor(() => {
      expect(mockSaveSettings).toHaveBeenCalled();
    });
  });

  it('save and close with unused components opens modal', () => {
    renderComponent(true, true);

    fireEvent.click(screen.getByTestId('save-and-close'));

    waitFor(() => {
      expect(mockSetIsManageProfileSettingsUnusedComponentsModalOpen).toHaveBeenCalled();
      expect(mockSetIsClosingNext).toHaveBeenCalled();
    });
  });

  it('save and close without unused components saves and navigates away', () => {
    renderComponent(true, false);

    fireEvent.click(screen.getByTestId('save-and-close'));

    waitFor(() => {
      expect(mockSaveSettings).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
