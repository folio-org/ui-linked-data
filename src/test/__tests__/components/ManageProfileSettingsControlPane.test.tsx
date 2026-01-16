import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { setInitialGlobalState } from '@src/test/__mocks__/store';
import { ManageProfileSettingsControlPane } from '@components/ManageProfileSettingsControlPane';
import { useManageProfileSettingsState, useUIState } from '@/store';

describe('ManageProfileSettingsControlPane', () => {
  const setIsManageProfileSettingsUnsavedModalOpen = jest.fn();
  const renderComponent = (isModified: boolean) => {
    setInitialGlobalState([
      {
        store: useManageProfileSettingsState,
        state: {
          isModified: isModified,
        },
      },
      {
        store: useUIState,
        state: {
          setIsManageProfileSettingsUnsavedModalOpen,
        },
      },
    ]);

    return render(
      <MemoryRouter>
        <ManageProfileSettingsControlPane />
      </MemoryRouter>,
    );
  };

  it('renders the pane', () => {
    renderComponent(false);

    expect(screen.getByTestId('manage-profile-settings-control-pane')).toBeInTheDocument();
  });

  it('close with modifications sets conditions to open confirm modal', () => {
    renderComponent(true);

    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(setIsManageProfileSettingsUnsavedModalOpen).toHaveBeenCalledWith(true);
  });

  it('close with no modifications navigates away', () => {
    renderComponent(false);

    fireEvent.click(screen.getByTestId('nav-close-button'));

    expect(setIsManageProfileSettingsUnsavedModalOpen).not.toHaveBeenCalled();
  });
});
