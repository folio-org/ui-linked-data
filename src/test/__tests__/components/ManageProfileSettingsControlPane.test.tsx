import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { ManageProfileSettingsControlPane } from '@components/ManageProfileSettingsControlPane';
import { useManageProfileSettingsState, useUIState } from '@/store';

describe('ManageProfileSettingsControlPane', () => {
  const setIsManageProfileSettingsUnsavedModalOpen = jest.fn();
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ManageProfileSettingsControlPane />
      </MemoryRouter>,
    );
  };

  it('renders the pane', () => {
    renderComponent();

    expect(screen.getByTestId('manage-profile-settings-control-pane')).toBeInTheDocument();
  });

  it('close with modifications sets conditions to open confirm modal', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isModified: true,
        },
      },
      {
        store: useUIState,
        state: {
          setIsManageProfileSettingsUnsavedModalOpen,
        },
      },
    ]);
    renderComponent();

    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(setIsManageProfileSettingsUnsavedModalOpen).toHaveBeenCalledWith(true);
  });

  it('close with no modifications navigates away', () => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isModified: false,
        },
      },
      {
        store: useUIState,
        state: {
          setIsManageProfileSettingsUnsavedModalOpen,
        },
      },
    ]);
    renderComponent();

    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(setIsManageProfileSettingsUnsavedModalOpen).not.toHaveBeenCalled();
  });
});
